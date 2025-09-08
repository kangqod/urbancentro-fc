import { RAINBOW_PLAYERS, BEST_PLAYERS, PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities'
import type { Player, Team, MatchFormatType } from '@/entities'

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function setPlayerCondition(team: Team) {
  team.players.forEach((player) => {
    player.condition = PLAYER_CONDITIONS.MID

    // BEST_PLAYERS 는 HIGH 로 컨트롤함
  })

  const lastIndex = team.players.length - 1
  for (let i = 0; i <= lastIndex; i++) {
    if (team.players[i].name === '지원 1' || team.players[i].name === '지원 2') {
      continue
    }
    if (team.players[i].condition === PLAYER_CONDITIONS.HIGH) {
      continue
    }
    if (RAINBOW_PLAYERS.some((p) => p.name === team.players[i].name && p.year === team.players[i].year)) {
      continue
    }
    if (BEST_PLAYERS.some((p) => p.name === team.players[i].name && p.year === team.players[i].year)) {
      continue
    }

    const probability = i === 1 ? 0.7 : i === 2 ? 0.3 : 0.02
    if (Math.random() < probability) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
    }
  }

  // team.player 중에 HIGH가 한명도 없다면 랜덤으로 한명 설정
  if (!team.players.some((p) => p.condition === PLAYER_CONDITIONS.HIGH)) {
    const candidates = team.players.filter(
      (p) =>
        p.name !== '지원 1' &&
        p.name !== '지원 2' &&
        !RAINBOW_PLAYERS.some((rp) => rp.name === p.name && rp.year === p.year) &&
        !BEST_PLAYERS.some((bp) => bp.name === p.name && bp.year === p.year)
    )
    if (candidates.length > 0) {
      const randomIdx = Math.floor(Math.random() * candidates.length)
      candidates[randomIdx].condition = PLAYER_CONDITIONS.HIGH
    }
  }
}

function distributeGuestsWithBalance(teams: Team[], guests: Player[], playersPerTeam: number) {
  if (guests.length === 0) return

  // 게스트를 연결된 선수가 있는지에 따라 분류
  const connectedGuests: Player[] = []
  const unconnectedGuests: Player[] = []

  guests.forEach((guest) => {
    if (guest.connectedPlayerIds && guest.connectedPlayerIds.length > 0) {
      connectedGuests.push(guest)
    } else {
      unconnectedGuests.push(guest)
    }
  })

  // 1. 연결된 게스트들을 먼저 배치
  connectedGuests.forEach((guest) => {
    const connectedPlayerTeam = teams.find((team) => team.players.some((player) => guest.connectedPlayerIds?.includes(player.id)))

    if (connectedPlayerTeam) {
      // 팀이 가득 찼으면 게스트를 넣고, 게스트가 아닌 선수를 다른 팀으로 이동
      if (connectedPlayerTeam.players.length >= playersPerTeam) {
        // 게스트가 아닌 선수 중 이동 가능한 선수 찾기
        const movablePlayer = connectedPlayerTeam.players.find(
          (player) => !player.isGuest && (!player.connectedPlayerIds || player.connectedPlayerIds.length === 0)
        )
        if (movablePlayer) {
          // 가장 적은 인원의 팀 찾기 (자기 팀 제외)
          const otherTeams = teams.filter((t) => t !== connectedPlayerTeam)
          const targetTeam = otherTeams.reduce((minTeam, currentTeam) =>
            currentTeam.players.length < minTeam.players.length ? currentTeam : minTeam
          )
          // 이동
          connectedPlayerTeam.players = connectedPlayerTeam.players.filter((p) => p.id !== movablePlayer.id)
          targetTeam.players.push(movablePlayer)
        }
        // 게스트는 무조건 연결된 선수의 팀에 넣음
        connectedPlayerTeam.players.push(guest)
      } else {
        // 팀에 자리가 있으면 그냥 넣음
        connectedPlayerTeam.players.push(guest)
      }
    } else {
      // 연결된 선수를 찾을 수 없으면 가장 적은 인원의 팀에 배치
      const targetTeam = teams.reduce((minTeam, currentTeam) =>
        currentTeam.players.length < minTeam.players.length ? currentTeam : minTeam
      )
      targetTeam.players.push(guest)
    }
  })

  // 2. 연결되지 않은 게스트들을 밸런스 있게 배치
  unconnectedGuests.forEach((guest) => {
    // 팀별 게스트 수를 고려하여 가장 적은 게스트를 가진 팀에 배치
    const teamGuestCounts = teams.map((team) => ({
      team,
      guestCount: team.players.filter((p) => p.isGuest).length,
      totalCount: team.players.length
    }))

    // 게스트 수가 적고, 전체 인원이 적은 팀 우선
    const sortedTeams = teamGuestCounts.sort((a, b) => {
      if (a.guestCount !== b.guestCount) {
        return a.guestCount - b.guestCount
      }
      return a.totalCount - b.totalCount
    })

    const targetTeam = sortedTeams.find((t) => t.totalCount < playersPerTeam)?.team || sortedTeams[0].team
    targetTeam.players.push(guest)
  })
}

function finalBalanceAdjustment(teams: Team[]) {
  // 팀 인원 수 차이가 2명 이상 나는 경우 조정
  const teamSizes = teams.map((team) => team.players.length)
  const maxSize = Math.max(...teamSizes)
  const minSize = Math.min(...teamSizes)

  if (maxSize - minSize > 1) {
    // 가장 많은 인원의 팀에서 가장 적은 인원의 팀으로 선수 이동
    const largestTeam = teams.find((team) => team.players.length === maxSize)
    const smallestTeam = teams.find((team) => team.players.length === minSize)

    if (largestTeam && smallestTeam) {
      // 게스트가 아닌 선수 중에서 이동 가능한 선수 찾기
      const movablePlayer = largestTeam.players.find(
        (player) =>
          !player.isGuest &&
          !player.connectedPlayerIds?.length && // 연결된 게스트가 없는 선수
          player.tier !== PLAYER_TIERS.ACE // ACE는 이동하지 않음
      )

      if (movablePlayer) {
        largestTeam.players = largestTeam.players.filter((p) => p.id !== movablePlayer.id)
        smallestTeam.players.push(movablePlayer)
      }
    }
  }
}

function disallowDuplicateSupport(teams: Team[], excludedPairs: string[][]) {
  excludedPairs.forEach(([player1Name, player2Name]) => {
    let player1Team: Team | undefined
    let player2Team: Team | undefined

    for (const team of teams) {
      if (team.players.some((p) => p.name === player1Name)) player1Team = team
      if (team.players.some((p) => p.name === player2Name)) player2Team = team
    }

    if (player1Team && player2Team && player1Team === player2Team) {
      // 두 선수가 같은 팀에 있다면 강제로 분리 (ex. 지원 1, 지원 2)

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
  const excludedPairs: string[][] = [['지원 1', '지원 2']]

  const teamSizes = mode.split(':').map(Number)
  const numTeams = teamSizes.length
  const playersPerTeam = teamSizes[0]

  // 게스트와 일반 선수를 분리
  const regularPlayers = players.filter((p) => !p.isGuest)
  const guests = players.filter((p) => p.isGuest)

  const tierMap: Record<string, Player[]> = {
    ace: [],
    advanced: [],
    intermediate: [],
    beginner: []
  }

  regularPlayers.forEach((player) => {
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

  // 1. 일반 선수들 먼저 배분
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

  // 2. 일반 선수 배치 완료 후 게스트 배치
  distributeGuestsWithBalance(teams, guests, playersPerTeam)

  // 3. 최종 밸런싱 조정
  finalBalanceAdjustment(teams)

  // 4. 기타 규칙 적용
  rebalanceAceDisadvantage(teams)
  disallowDuplicateSupport(teams, excludedPairs)
  teams.forEach(setPlayerCondition)
  teams.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  // log
  const temp = [...structuredClone(teams)]
  sortPlayersByTier(temp).forEach((team) => {
    const tier = team.players.map((player) => player.tier)
    console.log('Team: ', team.name, ', Tier: ', tier.join(', '))
  })

  return teams
}

function rebalanceAceDisadvantage(teams: Team[]) {
  const aceLessTeams = teams.filter((team) => !team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  const aceTeams = teams.filter((team) => team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  aceLessTeams.forEach((targetTeam) => {
    for (const donorTeam of aceTeams) {
      // 게스트와 연결된 선수(혹은 게스트)는 교환 대상에서 제외
      const donorAdvancedIndex = donorTeam.players.findIndex(
        (p) => p.tier === PLAYER_TIERS.ADVANCED && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
      )
      const targetIntermediateIndex = targetTeam.players.findIndex(
        (p) => p.tier === PLAYER_TIERS.INTERMEDIATE && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
      )

      if (donorAdvancedIndex !== -1 && targetIntermediateIndex !== -1) {
        // advanced <-> intermediate 교환
        const advanced = donorTeam.players.splice(donorAdvancedIndex, 1)[0]
        const intermediate = targetTeam.players.splice(targetIntermediateIndex, 1)[0]
        donorTeam.players.push(intermediate)
        targetTeam.players.push(advanced)
        break
      } else if (donorAdvancedIndex !== -1 && targetIntermediateIndex === -1) {
        // advanced <-> beginner 교환
        const targetBeginnerIndex = targetTeam.players.findIndex(
          (p) => p.tier === PLAYER_TIERS.BEGINNER && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
        )
        if (targetBeginnerIndex !== -1) {
          const advanced = donorTeam.players.splice(donorAdvancedIndex, 1)[0]
          const targetBeginner = targetTeam.players.splice(targetBeginnerIndex, 1)[0]
          donorTeam.players.push(targetBeginner)
          targetTeam.players.push(advanced)
          break
        }
      } else if (donorAdvancedIndex === -1 && targetIntermediateIndex === -1) {
        // intermediate <-> beginner 교환
        const donorIntermediateIndex = donorTeam.players.findIndex(
          (p) => p.tier === PLAYER_TIERS.INTERMEDIATE && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
        )
        const targetBeginnerIndex = targetTeam.players.findIndex(
          (p) => p.tier === PLAYER_TIERS.BEGINNER && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
        )
        if (donorIntermediateIndex !== -1 && targetBeginnerIndex !== -1) {
          const donorIntermediate = donorTeam.players.splice(donorIntermediateIndex, 1)[0]
          const targetBeginner = targetTeam.players.splice(targetBeginnerIndex, 1)[0]
          donorTeam.players.push(targetBeginner)
          targetTeam.players.push(donorIntermediate)
          break
        }
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
