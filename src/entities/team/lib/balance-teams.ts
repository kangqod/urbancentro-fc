import { PLAYER_CONDITIONS, PLAYER_POSITIONS } from '@/entities'
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
        // targetTeam에서 미드필더 한 명을 player1Team으로 이동
        const midfielder = targetTeam.players.find((p) => p.position === PLAYER_POSITIONS.MIDFIELDER)
        if (midfielder) {
          targetTeam.players = targetTeam.players.filter((p) => p.id !== midfielder.id)
          player1Team.players.push(midfielder)
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

  const positionMap: Record<string, Player[]> = {
    ace: [],
    forward: [],
    midfielder: [],
    defender: []
  }

  players.forEach((player) => {
    positionMap[player.position]?.push(player)
  })

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))

  const addToTeam = (player: Player, team: Team) => {
    team.players.push(player)
  }

  const distributeByCount = (position: string) => {
    const pool = shuffleArray(positionMap[position])
    const perTeam = Math.floor(pool.length / numTeams)
    let remainder = pool.length % numTeams

    teams.forEach((team) => {
      const count = perTeam + (remainder-- > 0 ? 1 : 0)
      for (let i = 0; i < count && pool.length > 0; i++) {
        addToTeam(pool.shift()!, team)
      }
    })
  }

  // ACE 먼저 배분
  distributeByCount(PLAYER_POSITIONS.ACE)

  // Defender 배분
  distributeByCount(PLAYER_POSITIONS.DEFENDER)

  // Forward도 defender 많은 팀 우선
  positionMap[PLAYER_POSITIONS.FORWARD] = shuffleArray(positionMap[PLAYER_POSITIONS.FORWARD])
  const forwardPool = [...positionMap[PLAYER_POSITIONS.FORWARD]]

  // 1. 팀을 defender 수 기준으로 정렬 (많은 팀 우선)
  const defenderSortedTeams = [...teams].sort(
    (a, b) =>
      b.players.filter((p) => p.position === PLAYER_POSITIONS.DEFENDER).length -
      a.players.filter((p) => p.position === PLAYER_POSITIONS.DEFENDER).length
  )

  // 2. 기본적으로 균등하게 분배
  const baseCount = Math.floor(forwardPool.length / teams.length)
  let remaining = forwardPool.length % teams.length

  // 3. 순차적으로 forward 배분
  defenderSortedTeams.forEach((team) => {
    let assignCount = baseCount
    // defender가 많은 팀일수록 하나 더 배정 (남은 forward가 있으면)
    if (remaining > 0) {
      assignCount++
      remaining--
    }

    while (assignCount > 0 && team.players.length < playersPerTeam && forwardPool.length > 0) {
      const player = forwardPool.shift()!
      addToTeam(player, team)
      assignCount--
    }
  })

  // 나머지 미드필더
  positionMap[PLAYER_POSITIONS.MIDFIELDER] = shuffleArray(positionMap[PLAYER_POSITIONS.MIDFIELDER])
  const midPool = [...positionMap[PLAYER_POSITIONS.MIDFIELDER]]
  while (midPool.length > 0) {
    teams.sort((a, b) => playersPerTeam - a.players.length - (playersPerTeam - b.players.length))
    const team = teams.find((t) => t.players.length < playersPerTeam)
    if (team) {
      addToTeam(midPool.shift()!, team)
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
  sortPlayersByPosition(temp).forEach((team) => {
    const position = team.players.map((player) => player.position)
    console.log('팀: ', team.name, ' 포지션: ', position.join(', '))
  })

  return teams
}

function rebalanceAceDisadvantage(teams: Team[]) {
  const aceLessTeams = teams.filter((team) => !team.players.some((p) => p.position === PLAYER_POSITIONS.ACE))

  const aceTeams = teams.filter((team) => team.players.some((p) => p.position === PLAYER_POSITIONS.ACE))

  aceLessTeams.forEach((targetTeam) => {
    for (const donorTeam of aceTeams) {
      const donorForwardIndex = donorTeam.players.findIndex((p) => p.position === PLAYER_POSITIONS.FORWARD)
      const targetMidfielderIndex = targetTeam.players.findIndex((p) => p.position === PLAYER_POSITIONS.MIDFIELDER)

      if (donorForwardIndex !== -1 && targetMidfielderIndex !== -1) {
        const forward = donorTeam.players.splice(donorForwardIndex, 1)[0]
        const midfielder = targetTeam.players.splice(targetMidfielderIndex, 1)[0]

        // 실제 객체 자체를 교환
        donorTeam.players.push(midfielder)
        targetTeam.players.push(forward)

        break // 보정됐으니 다음 ace 없는 팀으로
      }
    }
  })
}

function sortPlayersByPosition(teams: Team[]) {
  const positionOrder = [PLAYER_POSITIONS.ACE, PLAYER_POSITIONS.DEFENDER, PLAYER_POSITIONS.FORWARD, PLAYER_POSITIONS.MIDFIELDER]

  teams.forEach((team) => {
    team.players.sort((a, b) => {
      const positionA = positionOrder.indexOf(a.position)
      const positionB = positionOrder.indexOf(b.position)
      return positionA - positionB
    })
  })
  return teams
}
