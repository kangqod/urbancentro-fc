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

// 팀의 실력 점수를 계산하는 함수
function calculateTeamStrength(team: Team): number {
  const tierWeights = {
    [PLAYER_TIERS.ACE]: 4,
    [PLAYER_TIERS.ADVANCED]: 3,
    [PLAYER_TIERS.INTERMEDIATE]: 2,
    [PLAYER_TIERS.BEGINNER]: 1
  }

  return team.players.reduce((total, player) => {
    return total + (tierWeights[player.tier as keyof typeof tierWeights] || 1)
  }, 0)
}

// 팀간 밸런스를 체크하는 함수
function isTeamBalanced(teams: Team[]): boolean {
  const strengths = teams.map(calculateTeamStrength)
  const maxStrength = Math.max(...strengths)
  const minStrength = Math.min(...strengths)

  // 팀 간 실력 차이가 2 이하면 밸런스가 맞다고 판단
  return maxStrength - minStrength <= 2
}

// 연결된 게스트를 위한 스마트 배치 함수
function distributeConnectedGuestsWithBalance(teams: Team[], connectedGuests: Player[], playersPerTeam: number) {
  connectedGuests.forEach((guest) => {
    const connectedPlayerTeam = teams.find((team) => team.players.some((player) => guest.connectedPlayerIds?.includes(player.id)))

    if (connectedPlayerTeam) {
      // 연결된 선수의 팀에 자리가 있으면 그냥 추가
      if (connectedPlayerTeam.players.length < playersPerTeam) {
        connectedPlayerTeam.players.push(guest)
      } else {
        // 자리가 없으면 밸런스를 고려한 선수 교환
        handleTeamOverflow(teams, connectedPlayerTeam, guest, playersPerTeam)
      }
    } else {
      // 연결된 선수가 없으면 가장 약한 팀에 배치
      const weakestTeam = teams.reduce((weakest, current) =>
        calculateTeamStrength(current) < calculateTeamStrength(weakest) ? current : weakest
      )
      if (weakestTeam.players.length < playersPerTeam) {
        weakestTeam.players.push(guest)
      }
    }
  })
}

// 팀이 가득 찬 상황에서 밸런스를 고려한 선수 재배치
function handleTeamOverflow(teams: Team[], targetTeam: Team, guest: Player, playersPerTeam: number) {
  // 이동 가능한 선수들 (게스트가 아니고, 연결된 게스트가 없는 선수들)
  const movablePlayers = targetTeam.players.filter(
    (player) => !player.isGuest && (!player.connectedPlayerIds || player.connectedPlayerIds.length === 0)
  )

  if (movablePlayers.length === 0) {
    // 이동 가능한 선수가 없으면 그냥 추가 (팀 크기 초과)
    targetTeam.players.push(guest)
    return
  }

  // 다른 팀들 중에서 받을 수 있는 팀 찾기
  const availableTeams = teams.filter((team) => team !== targetTeam && team.players.length < playersPerTeam)

  if (availableTeams.length === 0) {
    targetTeam.players.push(guest)
    return
  }

  // 게스트를 추가했을 때와 선수를 이동했을 때의 밸런스를 시뮬레이션
  let bestMove: { player: Player; targetTeam: Team } | null = null
  let bestBalanceScore = Infinity

  movablePlayers.forEach((movablePlayer) => {
    availableTeams.forEach((availableTeam) => {
      // 시뮬레이션: 선수 이동 후 밸런스 계산
      const tempTeams = teams.map((team) => ({
        ...team,
        players: [...team.players]
      }))

      const tempTargetTeam = tempTeams.find((t) => t.name === targetTeam.name)!
      const tempAvailableTeam = tempTeams.find((t) => t.name === availableTeam.name)!

      // 선수 이동
      tempTargetTeam.players = tempTargetTeam.players.filter((p) => p.id !== movablePlayer.id)
      tempAvailableTeam.players.push(movablePlayer)
      tempTargetTeam.players.push(guest)

      // 밸런스 점수 계산
      const strengths = tempTeams.map(calculateTeamStrength)
      const balanceScore = Math.max(...strengths) - Math.min(...strengths)

      if (balanceScore < bestBalanceScore) {
        bestBalanceScore = balanceScore
        bestMove = { player: movablePlayer, targetTeam: availableTeam }
      }
    })
  })

  // 최적의 이동 실행
  if (bestMove !== null) {
    const b = bestMove as { player: Player; targetTeam: Team }
    targetTeam.players = targetTeam.players.filter((p) => p.id !== b.player.id)
    b.targetTeam.players.push(b.player)
  }

  targetTeam.players.push(guest)
}

// 연결되지 않은 게스트들을 밸런스 있게 배치
function distributeUnconnectedGuestsWithBalance(teams: Team[], unconnectedGuests: Player[], playersPerTeam: number) {
  unconnectedGuests.forEach((guest) => {
    // 게스트 티어를 고려한 최적 팀 선택
    let bestTeam: Team | null = null
    let bestScore = Infinity

    teams.forEach((team) => {
      if (team.players.length >= playersPerTeam) return

      // 게스트 추가 후 예상 밸런스 점수 계산
      const tempTeams = teams.map((t) => ({
        ...t,
        players: t === team ? [...t.players, guest] : [...t.players]
      }))

      const strengths = tempTeams.map(calculateTeamStrength)
      const balanceScore = Math.max(...strengths) - Math.min(...strengths)

      // 게스트 수도 고려 (게스트가 적은 팀 선호)
      const guestCount = team.players.filter((p) => p.isGuest).length
      const totalScore = balanceScore + guestCount * 0.5

      if (totalScore < bestScore) {
        bestScore = totalScore
        bestTeam = team
      }
    })

    if (bestTeam) {
      const b = bestTeam as Team
      b.players.push(guest)
    } else {
      // 모든 팀이 가득 찼으면 가장 약한 팀에 추가
      const weakestTeam = teams.reduce((weakest, current) =>
        calculateTeamStrength(current) < calculateTeamStrength(weakest) ? current : weakest
      )
      weakestTeam.players.push(guest)
    }
  })
}

// 게스트 배치를 위한 통합 함수
function distributeGuestsWithBalance(teams: Team[], guests: Player[], playersPerTeam: number) {
  if (guests.length === 0) return

  // 게스트를 연결된 선수가 있는지에 따라 분류
  const connectedGuests = guests.filter((guest) => guest.connectedPlayerIds && guest.connectedPlayerIds.length > 0)
  const unconnectedGuests = guests.filter((guest) => !guest.connectedPlayerIds || guest.connectedPlayerIds.length === 0)

  // 1. 연결된 게스트들을 먼저 배치 (밸런스 고려)
  distributeConnectedGuestsWithBalance(teams, connectedGuests, playersPerTeam)

  // 2. 연결되지 않은 게스트들을 밸런스 있게 배치
  distributeUnconnectedGuestsWithBalance(teams, unconnectedGuests, playersPerTeam)
}

// 게스트 배치 후 전체적인 밸런스 재조정
function rebalanceAfterGuestDistribution(teams: Team[]) {
  const maxIterations = 10
  let iteration = 0

  while (!isTeamBalanced(teams) && iteration < maxIterations) {
    const strengths = teams.map((team, index) => ({ team, strength: calculateTeamStrength(team), index }))
    strengths.sort((a, b) => b.strength - a.strength)

    const strongestTeam = strengths[0].team
    const weakestTeam = strengths[strengths.length - 1].team

    // 가장 강한 팀에서 가장 약한 팀으로 적절한 선수 이동
    const movableFromStrongest = strongestTeam.players.filter(
      (player) =>
        !player.isGuest && (!player.connectedPlayerIds || player.connectedPlayerIds.length === 0) && player.tier !== PLAYER_TIERS.ACE // ACE는 이동 금지
    )

    if (movableFromStrongest.length === 0) break

    // 이동할 선수 선택 (중간 티어 선호)
    const playerToMove =
      movableFromStrongest.find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE) ||
      movableFromStrongest.find((p) => p.tier === PLAYER_TIERS.ADVANCED) ||
      movableFromStrongest[0]

    if (playerToMove) {
      strongestTeam.players = strongestTeam.players.filter((p) => p.id !== playerToMove.id)
      weakestTeam.players.push(playerToMove)
    }

    iteration++
  }
}

function finalBalanceAdjustment(teams: Team[]) {
  // 먼저 게스트 배치로 인한 밸런스 문제 해결
  rebalanceAfterGuestDistribution(teams)

  // 기존의 인원 수 밸런스 조정
  const teamSizes = teams.map((team) => team.players.length)
  const maxSize = Math.max(...teamSizes)
  const minSize = Math.min(...teamSizes)

  if (maxSize - minSize > 1) {
    const largestTeam = teams.find((team) => team.players.length === maxSize)
    const smallestTeam = teams.find((team) => team.players.length === minSize)

    if (largestTeam && smallestTeam) {
      const movablePlayer = largestTeam.players.find(
        (player) => !player.isGuest && !player.connectedPlayerIds?.length && player.tier !== PLAYER_TIERS.ACE
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
      const targetTeam = teams.find((team) => team !== player1Team)

      if (targetTeam) {
        const player2 = player2Team.players.find((p) => p.name === player2Name)
        if (player2) {
          player1Team.players = player1Team.players.filter((p) => p.name !== player2Name)
          targetTeam.players.push(player2)
        }

        // 밸런스를 고려한 교환
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
  distributeByCount(PLAYER_TIERS.ACE)
  distributeByCount(PLAYER_TIERS.BEGINNER)

  // advanced 배분 (beginner 많은 팀 우선)
  tierMap[PLAYER_TIERS.ADVANCED] = shuffleArray(tierMap[PLAYER_TIERS.ADVANCED])
  const advancedPool = [...tierMap[PLAYER_TIERS.ADVANCED]]

  const beginnerSortedTeams = [...teams].sort(
    (a, b) =>
      b.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length - a.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length
  )

  const baseCount = Math.floor(advancedPool.length / teams.length)
  let remaining = advancedPool.length % teams.length

  beginnerSortedTeams.forEach((team) => {
    let assignCount = baseCount
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

  // intermediate 분배
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

  // 2. 개선된 게스트 배치 (밸런스 고려)
  distributeGuestsWithBalance(teams, guests, playersPerTeam)

  // 3. 최종 밸런싱 조정 (게스트 배치 후 밸런스 재조정 포함)
  finalBalanceAdjustment(teams)

  // 4. 기타 규칙 적용
  rebalanceAceDisadvantage(teams)
  disallowDuplicateSupport(teams, excludedPairs)
  teams.forEach(setPlayerCondition)
  teams.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  // 최종 밸런스 로깅
  console.log('=== Final Team Balance ===')
  const temp = [...structuredClone(teams)]
  sortPlayersByTier(temp).forEach((team) => {
    const tierCounts = {
      ace: team.players.filter((p) => p.tier === PLAYER_TIERS.ACE).length,
      advanced: team.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length,
      intermediate: team.players.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE).length,
      beginner: team.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length,
      guests: team.players.filter((p) => p.isGuest).length
    }
    const strength = calculateTeamStrength(team)
    console.log(
      `${team.name}: Strength(${strength}) - ACE(${tierCounts.ace}) ADV(${tierCounts.advanced}) INT(${tierCounts.intermediate}) BEG(${tierCounts.beginner}) Guest(${tierCounts.guests})`
    )
  })

  return teams
}

function rebalanceAceDisadvantage(teams: Team[]) {
  const aceLessTeams = teams.filter((team) => !team.players.some((p) => p.tier === PLAYER_TIERS.ACE))
  const aceTeams = teams.filter((team) => team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  aceLessTeams.forEach((targetTeam) => {
    for (const donorTeam of aceTeams) {
      const donorAdvancedIndex = donorTeam.players.findIndex(
        (p) => p.tier === PLAYER_TIERS.ADVANCED && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
      )
      const targetIntermediateIndex = targetTeam.players.findIndex(
        (p) => p.tier === PLAYER_TIERS.INTERMEDIATE && !p.isGuest && (!p.connectedPlayerIds || p.connectedPlayerIds.length === 0)
      )

      if (donorAdvancedIndex !== -1 && targetIntermediateIndex !== -1) {
        const advanced = donorTeam.players.splice(donorAdvancedIndex, 1)[0]
        const intermediate = targetTeam.players.splice(targetIntermediateIndex, 1)[0]
        donorTeam.players.push(intermediate)
        targetTeam.players.push(advanced)
        break
      } else if (donorAdvancedIndex !== -1 && targetIntermediateIndex === -1) {
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
