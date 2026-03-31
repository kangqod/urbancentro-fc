import { PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities/player/model/player'
import type { Player } from '@/entities/player/model/types'
import type { MatchFormatType, Team } from '@/entities/team/model/types'
import { BEST_PLAYERS, RAINBOW_PLAYERS, TIER_WEIGHTS } from './constants'

function getTierWeight(player: Player): number {
  return TIER_WEIGHTS[player.tier] ?? 1
}

function swapPlayersBetweenTeams(teamA: Team, playerA: Player, teamB: Team, playerB: Player): void {
  teamA.players = teamA.players.filter((p) => p.id !== playerA.id)
  teamB.players = teamB.players.filter((p) => p.id !== playerB.id)
  teamA.players.push(playerB)
  teamB.players.push(playerA)
}

function findWeakestTeam(teams: Team[], maxSize?: number): Team | null {
  const candidates = typeof maxSize === 'number' ? teams.filter((t) => t.players.length < maxSize) : teams

  if (candidates.length === 0) return null

  return candidates.reduce((weakest, current) =>
    calculateTeamStrength(current) < calculateTeamStrength(weakest) ? current : weakest
  )
}

function parseMode(mode: MatchFormatType): { teamSizes: number[]; numTeams: number; playersPerTeam: number; expectedTotal: number } {
  const teamSizes = mode.split(':').map(Number)
  const numTeams = teamSizes.length
  const playersPerTeam = teamSizes[0]
  const expectedTotal = teamSizes.reduce((total, size) => total + size, 0)
  return { teamSizes, numTeams, playersPerTeam, expectedTotal }
}

function assertValidMode(mode: MatchFormatType): void {
  const { teamSizes, playersPerTeam } = parseMode(mode)
  if (teamSizes.length === 0 || teamSizes.some((size) => !Number.isFinite(size) || size <= 0)) {
    throw new Error(`Invalid match format mode: ${mode}`)
  }
  if (teamSizes.some((size) => size !== playersPerTeam)) {
    throw new Error(`Unsupported match format mode (uneven team sizes): ${mode}`)
  }
}

function assertUniquePlayerIds(players: Player[]): void {
  const ids = players.map((player) => player.id)
  const uniqueCount = new Set(ids).size
  if (ids.length !== uniqueCount) {
    throw new Error('Invariant broken: duplicate player ids in input')
  }
}

function assertTeamsIntegrity(inputPlayers: Player[], teams: Team[]): void {
  const inputIds = inputPlayers.map((player) => player.id)
  const outputIds = teams.flatMap((team) => team.players.map((player) => player.id))
  const inputSet = new Set(inputIds)
  const outputSet = new Set(outputIds)

  if (outputIds.length !== outputSet.size) {
    throw new Error('Invariant broken: duplicate player ids in team result')
  }

  if (inputSet.size !== outputSet.size) {
    throw new Error('Invariant broken: player count mismatch between input and output teams')
  }

  for (const id of inputSet) {
    if (!outputSet.has(id)) {
      throw new Error(`Invariant broken: missing player in team result (${id})`)
    }
  }
}

// ==================== 유틸리티 함수 ====================

/** @internal test-only */
export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

// 팀의 실력 점수 계산
/** @internal test-only */
export function calculateTeamStrength(team: Team): number {
  return team.players.reduce((total, player) => {
    return total + getTierWeight(player)
  }, 0)
}

// 이동 가능한 선수 찾기
/** @internal test-only */
export function getMovablePlayers(team: Team, excludeTiers: string[] = []): Player[] {
  return team.players.filter(
    (player) =>
      !player.isGuest && (!player.connectedPlayerIds || player.connectedPlayerIds.length === 0) && !excludeTiers.includes(player.tier)
  )
}

// 팀별 티어 정보 가져오기
/** @internal test-only */
export function getTeamTierCounts(team: Team) {
  return {
    ace: team.players.filter((p) => p.tier === PLAYER_TIERS.ACE).length,
    advanced: team.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length,
    intermediate: team.players.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE).length,
    beginner: team.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length,
    guests: team.players.filter((p) => p.isGuest).length
  }
}

// ==================== 선수 컨디션 설정 ====================

/** @internal test-only */
export function setPlayerCondition(team: Team): void {
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

/** @internal test-only */
export function distributeRegularPlayers(teams: Team[], tierMap: Record<string, Player[]>, playersPerTeam: number): void {
  const numTeams = teams.length

  const acePool = shuffleArray(tierMap[PLAYER_TIERS.ACE])
  acePool.forEach((player, index) => {
    teams[index % numTeams].players.push(player)
  })

  const beginnerPool = shuffleArray(tierMap[PLAYER_TIERS.BEGINNER])
  const beginnerPerTeam = Math.floor(beginnerPool.length / numTeams)
  let beginnerRemainder = beginnerPool.length % numTeams

  teams.forEach((team) => {
    const count = beginnerPerTeam + (beginnerRemainder-- > 0 ? 1 : 0)
    for (let i = 0; i < count && beginnerPool.length > 0; i++) {
      team.players.push(beginnerPool.shift()!)
    }
  })

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

  while (advancedPool.length > 0) {
    const teamsByStrength = [...teams]
      .filter((t) => t.players.length < playersPerTeam)
      .sort((a, b) => calculateTeamStrength(a) - calculateTeamStrength(b))

    if (teamsByStrength.length === 0) break
    teamsByStrength[0].players.push(advancedPool.shift()!)
  }
}

// ==================== 게스트 배분 ====================

/** @internal test-only */
export function distributeGuests(teams: Team[], guests: Player[], playersPerTeam: number): void {
  if (guests.length === 0) return

  const connectedGuests = guests.filter((g) => g.connectedPlayerIds && g.connectedPlayerIds.length > 0)
  const unconnectedGuests = guests.filter((g) => !g.connectedPlayerIds || g.connectedPlayerIds.length === 0)

  connectedGuests.forEach((guest) => {
    const connectedTeam = teams.find((team) => team.players.some((p) => guest.connectedPlayerIds?.includes(p.id)))

    if (connectedTeam) {
      if (connectedTeam.players.length < playersPerTeam) {
        connectedTeam.players.push(guest)
      } else {
        const movablePlayers = getMovablePlayers(connectedTeam)
        const availableTeam = teams.find((t) => t !== connectedTeam && t.players.length < playersPerTeam)

        if (movablePlayers.length > 0 && availableTeam) {
          const playerToMove = movablePlayers.reduce((weakest, current) =>
            getTierWeight(current) < getTierWeight(weakest) ? current : weakest
          )

          connectedTeam.players = connectedTeam.players.filter((p) => p.id !== playerToMove.id)
          availableTeam.players.push(playerToMove)
        }
        connectedTeam.players.push(guest)
      }
    } else {
      const weakestTeam = findWeakestTeam(teams, playersPerTeam)
      if (!weakestTeam) {
        throw new Error(`Invariant broken: no capacity for connected guest (${guest.id})`)
      }
      weakestTeam.players.push(guest)
    }
  })

  unconnectedGuests.forEach((guest) => {
    let bestTeam: Team | null = null
    let bestScore = Infinity

    for (const team of teams) {
      if (team.players.length >= playersPerTeam) continue

      const guestCount = team.players.filter((p) => p.isGuest).length
      const strength = calculateTeamStrength(team)
      const score = strength + guestCount * 2

      if (score < bestScore) {
        bestScore = score
        bestTeam = team
      }
    }

    if (bestTeam) {
      bestTeam.players.push(guest)
    } else {
      const weakestTeam = findWeakestTeam(teams)
      if (weakestTeam) {
        weakestTeam.players.push(guest)
      }
    }
  })
}

// ==================== 팀 밸런싱 ====================

/** @internal test-only */
export function balanceTeamStrength(teams: Team[], maxIterations: number = 10): void {
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const strengths = teams.map((team) => calculateTeamStrength(team))
    const maxStrength = Math.max(...strengths)
    const minStrength = Math.min(...strengths)
    const gap = maxStrength - minStrength

    if (gap <= 2) break

    const strongestIndex = strengths.indexOf(maxStrength)
    const weakestIndex = strengths.indexOf(minStrength)
    const strongestTeam = teams[strongestIndex]
    const weakestTeam = teams[weakestIndex]

    const movablePlayers = getMovablePlayers(strongestTeam, [PLAYER_TIERS.ACE])

    if (movablePlayers.length === 0) break

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

/** @internal test-only */
export function balanceTeamSize(teams: Team[]): void {
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

/** @internal test-only */
export function balanceAceDisadvantage(teams: Team[]): void {
  const aceLessTeams = teams.filter((team) => !team.players.some((p) => p.tier === PLAYER_TIERS.ACE))
  const aceTeams = teams.filter((team) => team.players.some((p) => p.tier === PLAYER_TIERS.ACE))

  aceLessTeams.forEach((aceLessTeam) => {
    for (const aceTeam of aceTeams) {
      const aceTeamAdvanced = getMovablePlayers(aceTeam).find((p) => p.tier === PLAYER_TIERS.ADVANCED)
      const aceLessIntermediate = getMovablePlayers(aceLessTeam).find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE)

      if (aceTeamAdvanced && aceLessIntermediate) {
        swapPlayersBetweenTeams(aceTeam, aceTeamAdvanced, aceLessTeam, aceLessIntermediate)
        break
      }

      const aceLessBeginner = getMovablePlayers(aceLessTeam).find((p) => p.tier === PLAYER_TIERS.BEGINNER)
      if (aceTeamAdvanced && aceLessBeginner) {
        swapPlayersBetweenTeams(aceTeam, aceTeamAdvanced, aceLessTeam, aceLessBeginner)
        break
      }
    }
  })
}

/** @internal test-only */
export function balanceBeginnerHeavyTeams(teams: Team[]): void {
  const beginnerThreshold = 3

  teams.forEach((beginnerHeavyTeam) => {
    const beginnerCount = beginnerHeavyTeam.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length

    if (beginnerCount < beginnerThreshold) return

    const otherTeam = teams.find((team) => {
      if (team === beginnerHeavyTeam) return false
      return team.players.some((p) => p.tier === PLAYER_TIERS.INTERMEDIATE || p.tier === PLAYER_TIERS.ADVANCED)
    })

    if (!otherTeam) return

    const beginnerPlayer = getMovablePlayers(beginnerHeavyTeam).find((p) => p.tier === PLAYER_TIERS.BEGINNER)
    const betterPlayer = getMovablePlayers(otherTeam).find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE || p.tier === PLAYER_TIERS.ADVANCED)

    if (beginnerPlayer && betterPlayer) {
      swapPlayersBetweenTeams(beginnerHeavyTeam, beginnerPlayer, otherTeam, betterPlayer)
    }
  })
}

// ==================== 특수 규칙 ====================

/** @internal test-only */
export function enforceExcludedPairs(teams: Team[], excludedPairs: string[][]): void {
  excludedPairs.forEach(([player1Name, player2Name]) => {
    const player1Team = teams.find((team) => team.players.some((p) => p.name === player1Name))
    const player2Team = teams.find((team) => team.players.some((p) => p.name === player2Name))

    if (player1Team && player2Team && player1Team === player2Team) {
      const otherTeams = teams.filter((team) => team !== player1Team)
      if (otherTeams.length === 0) return

      const player2 = player1Team.players.find((p) => p.name === player2Name)
      if (!player2) return

      let swapSuccess = false

      for (const otherTeam of otherTeams) {
        const movableFromOther = getMovablePlayers(otherTeam)

        const swapCandidate =
          movableFromOther.find((p) => p.tier === player2.tier) ||
          movableFromOther.find((p) => p.tier === PLAYER_TIERS.INTERMEDIATE) ||
          movableFromOther.find((p) => p.tier === PLAYER_TIERS.BEGINNER) ||
          movableFromOther[0]

        if (swapCandidate) {
          swapPlayersBetweenTeams(player1Team, player2, otherTeam, swapCandidate)
          swapSuccess = true
          break
        }
      }

      if (!swapSuccess) {
        const targetTeam = otherTeams[0]
        player1Team.players = player1Team.players.filter((p) => p.name !== player2Name)
        targetTeam.players.push(player2)
      }
    }
  })
}

// ==================== 로깅 ====================

function logFinalBalance(teams: Team[]): void {
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
  assertValidMode(mode)
  assertUniquePlayerIds(players)
  const { numTeams, playersPerTeam, expectedTotal } = parseMode(mode)

  if (players.length !== expectedTotal) {
    throw new Error(`Invalid player count for ${mode}: expected ${expectedTotal}, received ${players.length}`)
  }

  const regularPlayers = players.filter((p) => !p.isGuest)
  const guests = players.filter((p) => p.isGuest)

  const tierMap: Record<string, Player[]> = {
    [PLAYER_TIERS.ACE]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.ACE),
    [PLAYER_TIERS.ADVANCED]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.ADVANCED),
    [PLAYER_TIERS.INTERMEDIATE]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE),
    [PLAYER_TIERS.BEGINNER]: regularPlayers.filter((p) => p.tier === PLAYER_TIERS.BEGINNER)
  }

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))

  distributeRegularPlayers(teams, tierMap, playersPerTeam)
  distributeGuests(teams, guests, playersPerTeam)

  balanceAceDisadvantage(teams)
  balanceBeginnerHeavyTeams(teams)

  enforceExcludedPairs(teams, excludedPairs)

  balanceTeamStrength(teams)
  balanceTeamSize(teams)

  teams.forEach(setPlayerCondition)
  teams.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  assertTeamsIntegrity(players, teams)

  logFinalBalance(teams)

  return teams
}
