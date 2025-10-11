import { RAINBOW_PLAYERS, BEST_PLAYERS, PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities'
import type { Player, Team, MatchFormatType } from '@/entities'

// ==================== 유틸리티 함수 ====================

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

// 팀의 실력 점수 계산
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

// 이동 가능한 선수 찾기
function getMovablePlayers(team: Team, excludeTiers: string[] = []): Player[] {
  return team.players.filter(
    (player) =>
      !player.isGuest && (!player.connectedPlayerIds || player.connectedPlayerIds.length === 0) && !excludeTiers.includes(player.tier)
  )
}

// 팀별 티어 정보 가져오기
function getTeamTierCounts(team: Team) {
  return {
    ace: team.players.filter((p) => p.tier === PLAYER_TIERS.ACE).length,
    advanced: team.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length,
    intermediate: team.players.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE).length,
    beginner: team.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length,
    guests: team.players.filter((p) => p.isGuest).length
  }
}

// ==================== 선수 컨디션 설정 ====================

function setPlayerCondition(team: Team) {
  team.players.forEach((player) => {
    player.condition = PLAYER_CONDITIONS.MID
  })

  const lastIndex = team.players.length - 1
  for (let i = 0; i <= lastIndex; i++) {
    const player = team.players[i]

    if (player.name === '지원 1' || player.name === '지원 2') continue
    if (player.condition === PLAYER_CONDITIONS.HIGH) continue
    if (RAINBOW_PLAYERS.some((p) => p.name === player.name && p.year === player.year)) continue
    if (BEST_PLAYERS.some((p) => p.name === player.name && p.year === player.year)) continue

    const probability = i === 1 ? 0.7 : i === 2 ? 0.3 : 0.02
    if (Math.random() < probability) {
      player.condition = PLAYER_CONDITIONS.HIGH
    }
  }

  // HIGH 컨디션 선수가 없으면 랜덤 배정
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

// ==================== 초기 팀 배분 ====================

function distributeRegularPlayers(teams: Team[], tierMap: Record<string, Player[]>, playersPerTeam: number) {
  const numTeams = teams.length

  // 1. ACE 배분 (균등 분배)
  const acePool = shuffleArray(tierMap[PLAYER_TIERS.ACE])
  acePool.forEach((player, index) => {
    teams[index % numTeams].players.push(player)
  })

  // 2. BEGINNER 배분 (균등 분배)
  const beginnerPool = shuffleArray(tierMap[PLAYER_TIERS.BEGINNER])
  const beginnerPerTeam = Math.floor(beginnerPool.length / numTeams)
  let beginnerRemainder = beginnerPool.length % numTeams

  teams.forEach((team) => {
    const count = beginnerPerTeam + (beginnerRemainder-- > 0 ? 1 : 0)
    for (let i = 0; i < count && beginnerPool.length > 0; i++) {
      team.players.push(beginnerPool.shift()!)
    }
  })

  // 3. ADVANCED 배분 (beginner 많은 팀 우선)
  const advancedPool = shuffleArray(tierMap[PLAYER_TIERS.ADVANCED])
  const teamsByBeginnerCount = [...teams].sort((a, b) => {
    const aBeginners = a.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length
    const bBeginners = b.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length
    return bBeginners - aBeginners
  })

  const advancedPerTeam = Math.floor(advancedPool.length / numTeams)
  let advancedRemainder = advancedPool.length % numTeams

  teamsByBeginnerCount.forEach((team) => {
    const count = advancedPerTeam + (advancedRemainder-- > 0 ? 1 : 0)
    for (let i = 0; i < count && advancedPool.length > 0 && team.players.length < playersPerTeam; i++) {
      team.players.push(advancedPool.shift()!)
    }
  })

  // 4. INTERMEDIATE 배분 (약한 팀 우선, ACE 팀 선호)
  const intermediatePool = shuffleArray(tierMap[PLAYER_TIERS.INTERMEDIATE])

  while (intermediatePool.length > 0) {
    const teamsByStrength = [...teams]
      .filter((t) => t.players.length < playersPerTeam)
      .sort((a, b) => {
        const aHasAce = a.players.some((p) => p.tier === PLAYER_TIERS.ACE) ? 1 : 0
        const bHasAce = b.players.some((p) => p.tier === PLAYER_TIERS.ACE) ? 1 : 0
        if (aHasAce !== bHasAce) return bHasAce - aHasAce
        return calculateTeamStrength(a) - calculateTeamStrength(b)
      })

    if (teamsByStrength.length === 0) break
    teamsByStrength[0].players.push(intermediatePool.shift()!)
  }

  // 5. 남은 ADVANCED 배분 (약한 팀 우선)
  while (advancedPool.length > 0) {
    const teamsByStrength = [...teams]
      .filter((t) => t.players.length < playersPerTeam)
      .sort((a, b) => calculateTeamStrength(a) - calculateTeamStrength(b))

    if (teamsByStrength.length === 0) break
    teamsByStrength[0].players.push(advancedPool.shift()!)
  }
}

// ==================== 게스트 배분 ====================

function distributeGuests(teams: Team[], guests: Player[], playersPerTeam: number) {
  if (guests.length === 0) return

  // 연결된 게스트와 일반 게스트 분류
  const connectedGuests = guests.filter((g) => g.connectedPlayerIds && g.connectedPlayerIds.length > 0)
  const unconnectedGuests = guests.filter((g) => !g.connectedPlayerIds || g.connectedPlayerIds.length === 0)

  // 1. 연결된 게스트 배치
  connectedGuests.forEach((guest) => {
    const connectedTeam = teams.find((team) => team.players.some((p) => guest.connectedPlayerIds?.includes(p.id)))

    if (connectedTeam) {
      if (connectedTeam.players.length < playersPerTeam) {
        connectedTeam.players.push(guest)
      } else {
        // 팀이 가득 찬 경우: 약한 선수를 다른 팀으로 이동
        const movablePlayers = getMovablePlayers(connectedTeam)
        const availableTeam = teams.find((t) => t !== connectedTeam && t.players.length < playersPerTeam)

        if (movablePlayers.length > 0 && availableTeam) {
          // 가장 약한 이동 가능 선수 선택
          const playerToMove = movablePlayers.reduce((weakest, current) => {
            const weights = { ace: 4, advanced: 3, intermediate: 2, beginner: 1 }
            const weakestWeight = weights[weakest.tier as keyof typeof weights] || 1
            const currentWeight = weights[current.tier as keyof typeof weights] || 1
            return currentWeight < weakestWeight ? current : weakest
          })

          connectedTeam.players = connectedTeam.players.filter((p) => p.id !== playerToMove.id)
          availableTeam.players.push(playerToMove)
        }
        connectedTeam.players.push(guest)
      }
    } else {
      // 연결된 선수가 없으면 약한 팀에 배치
      const weakestTeam = teams
        .filter((t) => t.players.length < playersPerTeam)
        .reduce((weakest, current) => (calculateTeamStrength(current) < calculateTeamStrength(weakest) ? current : weakest))
      if (weakestTeam) {
        weakestTeam.players.push(guest)
      }
    }
  })

  // 2. 일반 게스트 배치 (밸런스 고려)
  let bestTeam: Team | null = null
  unconnectedGuests.forEach((guest) => {
    let bestScore = Infinity

    teams.forEach((team) => {
      if (team.players.length >= playersPerTeam) return

      // 게스트 추가 후 예상 밸런스 계산
      const guestCount = team.players.filter((p) => p.isGuest).length
      const strength = calculateTeamStrength(team)

      // 약한 팀이면서 게스트가 적은 팀 선호
      const score = strength + guestCount * 2

      if (score < bestScore) {
        bestScore = score
        bestTeam = team as Team
      }
    })

    if (bestTeam) {
      bestTeam.players.push(guest)
    } else {
      // 모든 팀이 가득 차면 가장 약한 팀에 추가
      const weakestTeam = teams.reduce((weakest, current) =>
        calculateTeamStrength(current) < calculateTeamStrength(weakest) ? current : weakest
      )
      weakestTeam.players.push(guest)
    }
  })
}

// ==================== 팀 밸런싱 ====================

function balanceTeamStrength(teams: Team[], maxIterations: number = 10) {
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const strengths = teams.map((team) => calculateTeamStrength(team))
    const maxStrength = Math.max(...strengths)
    const minStrength = Math.min(...strengths)
    const gap = maxStrength - minStrength

    // 밸런스가 충분히 좋으면 종료
    if (gap <= 2) break

    const strongestIndex = strengths.indexOf(maxStrength)
    const weakestIndex = strengths.indexOf(minStrength)
    const strongestTeam = teams[strongestIndex]
    const weakestTeam = teams[weakestIndex]

    // 강한 팀에서 약한 팀으로 선수 이동
    const movablePlayers = getMovablePlayers(strongestTeam, [PLAYER_TIERS.ACE])

    if (movablePlayers.length === 0) break

    // INTERMEDIATE 또는 ADVANCED를 우선적으로 이동
    const playerToMove =
      movablePlayers.find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE) ||
      movablePlayers.find((p) => p.tier === PLAYER_TIERS.ADVANCED) ||
      movablePlayers[0]

    if (playerToMove) {
      strongestTeam.players = strongestTeam.players.filter((p) => p.id !== playerToMove.id)
      weakestTeam.players.push(playerToMove)
    } else {
      break
    }
  }
}

function balanceTeamSize(teams: Team[]) {
  const teamSizes = teams.map((t) => t.players.length)
  const maxSize = Math.max(...teamSizes)
  const minSize = Math.min(...teamSizes)

  if (maxSize - minSize <= 1) return

  const largestTeam = teams.find((t) => t.players.length === maxSize)
  const smallestTeam = teams.find((t) => t.players.length === minSize)

  if (largestTeam && smallestTeam) {
    const movablePlayers = getMovablePlayers(largestTeam, [PLAYER_TIERS.ACE])
    if (movablePlayers.length > 0) {
      const playerToMove = movablePlayers[0]
      largestTeam.players = largestTeam.players.filter((p) => p.id !== playerToMove.id)
      smallestTeam.players.push(playerToMove)
    }
  }
}

function balanceAceDisadvantage(teams: Team[]) {
  const aceLessTeams = teams.filter((team) => !team.players.some((p) => p.tier === PLAYER_TIERS.ACE))
  const aceTeams = teams.filter((team) => team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  aceLessTeams.forEach((aceLessTeam) => {
    for (const aceTeam of aceTeams) {
      const aceTeamAdvanced = getMovablePlayers(aceTeam).find((p) => p.tier === PLAYER_TIERS.ADVANCED)
      const aceLessIntermediate = getMovablePlayers(aceLessTeam).find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE)

      if (aceTeamAdvanced && aceLessIntermediate) {
        aceTeam.players = aceTeam.players.filter((p) => p.id !== aceTeamAdvanced.id)
        aceLessTeam.players = aceLessTeam.players.filter((p) => p.id !== aceLessIntermediate.id)
        aceTeam.players.push(aceLessIntermediate)
        aceLessTeam.players.push(aceTeamAdvanced)
        break
      }

      const aceLessBeginner = getMovablePlayers(aceLessTeam).find((p) => p.tier === PLAYER_TIERS.BEGINNER)
      if (aceTeamAdvanced && aceLessBeginner) {
        aceTeam.players = aceTeam.players.filter((p) => p.id !== aceTeamAdvanced.id)
        aceLessTeam.players = aceLessTeam.players.filter((p) => p.id !== aceLessBeginner.id)
        aceTeam.players.push(aceLessBeginner)
        aceLessTeam.players.push(aceTeamAdvanced)
        break
      }
    }
  })
}

function balanceBeginnerHeavyTeams(teams: Team[]) {
  const beginnerThreshold = 3

  teams.forEach((beginnerHeavyTeam) => {
    const beginnerCount = beginnerHeavyTeam.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length

    if (beginnerCount < beginnerThreshold) return

    // INTERMEDIATE 또는 ADVANCED가 있는 다른 팀 찾기
    const otherTeam = teams.find((team) => {
      if (team === beginnerHeavyTeam) return false
      return team.players.some((p) => p.tier === PLAYER_TIERS.INTERMEDIATE || p.tier === PLAYER_TIERS.ADVANCED)
    })

    if (!otherTeam) return

    const beginnerPlayer = getMovablePlayers(beginnerHeavyTeam).find((p) => p.tier === PLAYER_TIERS.BEGINNER)
    const betterPlayer = getMovablePlayers(otherTeam).find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE || p.tier === PLAYER_TIERS.ADVANCED)

    if (beginnerPlayer && betterPlayer) {
      beginnerHeavyTeam.players = beginnerHeavyTeam.players.filter((p) => p.id !== beginnerPlayer.id)
      otherTeam.players = otherTeam.players.filter((p) => p.id !== betterPlayer.id)
      beginnerHeavyTeam.players.push(betterPlayer)
      otherTeam.players.push(beginnerPlayer)
    }
  })
}

// ==================== 특수 규칙 ====================

function enforceExcludedPairs(teams: Team[], excludedPairs: string[][]) {
  excludedPairs.forEach(([player1Name, player2Name]) => {
    const player1Team = teams.find((team) => team.players.some((p) => p.name === player1Name))
    const player2Team = teams.find((team) => team.players.some((p) => p.name === player2Name))

    // 같은 팀에 있는 경우만 처리
    if (player1Team && player2Team && player1Team === player2Team) {
      const otherTeams = teams.filter((team) => team !== player1Team)
      if (otherTeams.length === 0) return

      const player2 = player1Team.players.find((p) => p.name === player2Name)
      if (!player2) return

      // 교환할 선수를 먼저 찾기 (반드시 1:1 교환)
      let swapSuccess = false

      for (const otherTeam of otherTeams) {
        const movableFromOther = getMovablePlayers(otherTeam)

        // 비슷한 티어의 선수를 찾아서 교환
        const swapCandidate =
          movableFromOther.find((p) => p.tier === player2.tier) ||
          movableFromOther.find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE) ||
          movableFromOther.find((p) => p.tier === PLAYER_TIERS.BEGINNER) ||
          movableFromOther[0]

        if (swapCandidate) {
          // 1:1 교환 실행
          player1Team.players = player1Team.players.filter((p) => p.name !== player2Name)
          otherTeam.players = otherTeam.players.filter((p) => p.id !== swapCandidate.id)

          player1Team.players.push(swapCandidate)
          otherTeam.players.push(player2)

          swapSuccess = true
          break
        }
      }

      // 교환 가능한 선수가 없는 경우 (최후의 수단)
      if (!swapSuccess) {
        const targetTeam = otherTeams[0]
        player1Team.players = player1Team.players.filter((p) => p.name !== player2Name)
        targetTeam.players.push(player2)
      }
    }
  })
}

// ==================== 로깅 ====================

function logFinalBalance(teams: Team[]) {
  console.log('\n=== Final Team Balance ===')
  teams.forEach((team) => {
    const tierCounts = getTeamTierCounts(team)
    const strength = calculateTeamStrength(team)
    console.log(
      `${team.name}: Strength(${strength}) - ACE(${tierCounts.ace}) ADV(${tierCounts.advanced}) INT(${tierCounts.intermediate}) BEG(${tierCounts.beginner}) Guest(${tierCounts.guests})`
    )
  })

  const strengths = teams.map(calculateTeamStrength)
  const gap = Math.max(...strengths) - Math.min(...strengths)
  console.log(`Balance Gap: ${gap}`)
}

// ==================== 메인 함수 ====================

export function balanceTeams(players: Player[], mode: MatchFormatType): Team[] {
  const excludedPairs: string[][] = [['지원 1', '지원 2']]
  const teamSizes = mode.split(':').map(Number)
  const numTeams = teamSizes.length
  const playersPerTeam = teamSizes[0]

  // 게스트와 일반 선수 분리
  const regularPlayers = players.filter((p) => !p.isGuest)
  const guests = players.filter((p) => p.isGuest)

  // 티어별 선수 분류
  const tierMap: Record<string, Player[]> = {
    [PLAYER_TIERS.ACE]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.ACE),
    [PLAYER_TIERS.ADVANCED]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.ADVANCED),
    [PLAYER_TIERS.INTERMEDIATE]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE),
    [PLAYER_TIERS.BEGINNER]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.BEGINNER)
  }

  // 팀 초기화
  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))

  // 1. 일반 선수 배분
  distributeRegularPlayers(teams, tierMap, playersPerTeam)

  // 2. 게스트 배분
  distributeGuests(teams, guests, playersPerTeam)

  // 3. 팀 밸런싱
  balanceAceDisadvantage(teams)
  balanceBeginnerHeavyTeams(teams)

  // 4. 특수 규칙 적용 (밸런싱 전에 처리)
  enforceExcludedPairs(teams, excludedPairs)

  // 5. 최종 밸런싱 (특수 규칙 적용 후)
  balanceTeamStrength(teams)
  balanceTeamSize(teams)

  // 6. 컨디션 설정 및 정렬
  teams.forEach(setPlayerCondition)
  teams.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  // 7. 최종 결과 로깅
  logFinalBalance(teams)

  return teams
}
