import { PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities'
import type { Player, Team, MatchFormatType } from '@/entities'

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function setPlayerCondition(team: Team) {
  team.players.forEach((player) => {
    player.condition = PLAYER_CONDITIONS.MID
  })

  const lastIndex = team.players.length - 1
  for (let i = 0; i <= lastIndex; i++) {
    if (team.players[i].name === '지원' || team.players[i].name === '지원 2') {
      continue
    }
    if (i === 0 || i === lastIndex) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
      continue
    }
    const probability = i === 1 ? 0.7 : i === 2 ? 0.5 : 0.02
    if (Math.random() < probability) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
    }
  }
}

function ensurePlayerSeparation(teams: Team[], excludedPairs: string[][]) {
  excludedPairs.forEach(([player1Name, player2Name]) => {
    let player1Team: Team | undefined
    let player2Team: Team | undefined

    for (const team of teams) {
      if (team.players.some((p) => p.name === player1Name)) player1Team = team
      if (team.players.some((p) => p.name === player2Name)) player2Team = team
    }

    if (player1Team && player2Team && player1Team === player2Team) {
      // 두 선수가 같은 팀에 있다면 강제로 분리 (ex. 지원, 지원 2)

      const targetTeam = teams.find((team) => team !== player1Team)

      if (targetTeam) {
        const player2 = player2Team.players.find((p) => p.name === player2Name)
        if (player2) {
          player1Team.players = player1Team.players.filter((p) => p.name !== player2Name)
          targetTeam.players.push(player2)
        }
        // targetTeam에서 intermediate 한 명을 player1Team으로 이동
        const intermediatePlayer = targetTeam.players.find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE)
        if (intermediatePlayer) {
          targetTeam.players = targetTeam.players.filter((p) => p.id !== intermediatePlayer.id)
          player1Team.players.push(intermediatePlayer)
        }
      }
    }
  })
}

export function balanceTeams(players: Player[], mode: MatchFormatType): Team[] {
  const excludedPairs: string[][] = [['지원', '지원 2']]

  const teamSizes = mode.split(':').map(Number)
  const numTeams = teamSizes.length
  const playersPerTeam = teamSizes[0]

  const tierMap: Record<string, Player[]> = {
    ace: [],
    advanced: [],
    intermediate: [],
    beginner: []
  }

  players.forEach((player) => {
    tierMap[player.tier]?.push(player)
  })

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))

  const addToTeam = (player: Player, team: Team) => {
    team.players.push(player)
  }

  const distributeByCount = (tier: string) => {
    const pool = shuffleArray(tierMap[tier])
    const perTeam = Math.floor(pool.length / numTeams)
    let remainder = pool.length % numTeams

    teams.forEach((team) => {
      const count = perTeam + (remainder-- > 0 ? 1 : 0)
      for (let i = 0; i < count && pool.length > 0; i++) {
        addToTeam(pool.shift()!, team)
      }
    })
  }

  // ace 먼저 배분
  distributeByCount(PLAYER_TIERS.ACE)

  // beginner 배분
  distributeByCount(PLAYER_TIERS.BEGINNER)

  // advanced 도 beginner 많은 팀 우선
  tierMap[PLAYER_TIERS.ADVANCED] = shuffleArray(tierMap[PLAYER_TIERS.ADVANCED])
  const advancedPool = [...tierMap[PLAYER_TIERS.ADVANCED]]

  // 1. 팀을 beginner 수 기준으로 정렬 (많은 팀 우선)
  const beginnerSortedTeams = [...teams].sort(
    (a, b) =>
      b.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length - a.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length
  )

  // 2. 기본적으로 균등하게 분배
  const baseCount = Math.floor(advancedPool.length / teams.length)
  let remaining = advancedPool.length % teams.length

  // 3. 순차적으로 advanced 배분
  beginnerSortedTeams.forEach((team) => {
    let assignCount = baseCount
    // beginner 가 많은 팀일수록 하나 더 배정 (남은 advanced가 있으면)
    if (remaining > 0) {
      assignCount++
      remaining--
    }

    while (assignCount > 0 && team.players.length < playersPerTeam && advancedPool.length > 0) {
      const player = advancedPool.shift()!
      addToTeam(player, team)
      assignCount--
    }
  })

  // 4. intermediate 분배
  tierMap[PLAYER_TIERS.INTERMEDIATE] = shuffleArray(tierMap[PLAYER_TIERS.INTERMEDIATE])
  const intermediatePool = [...tierMap[PLAYER_TIERS.INTERMEDIATE]]
  while (intermediatePool.length > 0) {
    teams.sort((a, b) => playersPerTeam - a.players.length - (playersPerTeam - b.players.length))
    const team = teams.find((t) => t.players.length < playersPerTeam)
    if (team) {
      addToTeam(intermediatePool.shift()!, team)
    } else {
      break
    }
  }

  ensurePlayerSeparation(teams, excludedPairs)
  rebalanceAceDisadvantage(teams)
  teams.forEach(setPlayerCondition)
  teams.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  // log
  const temp = [...structuredClone(teams)]
  sortPlayersByTier(temp).forEach((team) => {
    const tier = team.players.map((player) => player.tier)
    console.log('Team: ', team.name, ' Tier: ', tier.join(', '))
  })

  return teams
}

function rebalanceAceDisadvantage(teams: Team[]) {
  const aceLessTeams = teams.filter((team) => !team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  const aceTeams = teams.filter((team) => team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  aceLessTeams.forEach((targetTeam) => {
    for (const donorTeam of aceTeams) {
      const donorAdvancedIndex = donorTeam.players.findIndex((p) => p.tier === PLAYER_TIERS.ADVANCED)
      const targetIntermediateIndex = targetTeam.players.findIndex((p) => p.tier === PLAYER_TIERS.INTERMEDIATE)

      if (donorAdvancedIndex !== -1 && targetIntermediateIndex !== -1) {
        const advanced = donorTeam.players.splice(donorAdvancedIndex, 1)[0]
        const intermediate = targetTeam.players.splice(targetIntermediateIndex, 1)[0]

        // 실제 객체 자체를 교환
        donorTeam.players.push(intermediate)
        targetTeam.players.push(advanced)

        break // 보정됐으니 다음 ace 없는 팀으로
      }
    }
  })
}

function sortPlayersByTier(teams: Team[]) {
  const tierOrder = [PLAYER_TIERS.ACE, PLAYER_TIERS.BEGINNER, PLAYER_TIERS.ADVANCED, PLAYER_TIERS.INTERMEDIATE]

  teams.forEach((team) => {
    team.players.sort((a, b) => {
      const tierA = tierOrder.indexOf(a.tier)
      const tierB = tierOrder.indexOf(b.tier)
      return tierA - tierB
    })
  })
  return teams
}
