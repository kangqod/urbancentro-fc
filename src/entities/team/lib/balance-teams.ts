import { PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities/player/model/player'
import type { Player } from '@/entities/player/model/types'
import type { MatchFormatType, Team } from '@/entities/team/model/types'
import {
  ArrangementScore,
  calculateTeamStrength,
  compareScore,
  getTierWeight,
  scoreArrangement,
  strengthGap
} from './balance-score'
import { CONDITION_EXEMPT_NAMES, EXCLUDED_PAIRS, PREMIUM_PLAYERS } from './constants'

// calculateTeamStrength 은 balance-score 로 이동했으나 공개 표면 유지를 위해 재export 한다.
// (index.ts 가 './balance-teams' 에서 calculateTeamStrength 를 export 하고,
//  team-balance-log.tsx 가 이를 사용한다.)
export { calculateTeamStrength } from './balance-score'

/**
 * K개 후보를 생성해 점수화한 뒤 near-best 밴드에서 랜덤 선택한다.
 * 후보 생성은 '완전 랜덤'(전체 셔플 후 라운드로빈)이다 — 구조적(snake/티어별) 분배는
 * 왜곡된 로스터에서 gap<=1 이 요구하는 티어 불균형(예: 중급 1:3) 배치를 못 만들어
 * 밴드0 을 영영 못 찾는다. K 는 밴드0(gap<=1) 달성률(하드 로스터에서도 200회 반복 중
 * 밴드0 0개일 확률이 무시할 수준)을 확보하도록 크게 잡는다.
 */
const CANDIDATE_COUNT = 400

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

function assertEqualTeamSizes(teams: Team[]): void {
  const sizes = teams.map((t) => t.players.length)
  if (Math.max(...sizes) - Math.min(...sizes) > 1) {
    throw new Error('Invariant broken: team sizes differ by more than 1')
  }
}

// ==================== 유틸리티 함수 ====================

/** @internal test-only */
export function shuffleArray<T>(array: T[]): T[] {
  // Fisher–Yates: 균일한 순열 분포를 보장한다. (sort(() => Math.random() - 0.5) 는
  // 비추이적 비교자라 near-identity 로 편향되어 후보 다양성/공정성을 훼손했다.)
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 이동 가능한 선수 찾기 (게스트/연결선수 제외)
/** @internal test-only */
export function getMovablePlayers(team: Team): Player[] {
  return team.players.filter(
    (player) => !player.isGuest && (!player.connectedPlayerIds || player.connectedPlayerIds.length === 0)
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

    if (CONDITION_EXEMPT_NAMES.includes(player.name)) continue
    if (player.condition === PLAYER_CONDITIONS.HIGH) continue
    if (PREMIUM_PLAYERS.some((p) => p.name === player.name && p.year === player.year)) continue

    const probability = i === 1 ? 0.7 : i === 2 ? 0.3 : 0.02
    if (Math.random() < probability) {
      player.condition = PLAYER_CONDITIONS.HIGH
    }
  }

  if (!team.players.some((p) => p.condition === PLAYER_CONDITIONS.HIGH)) {
    const candidates = team.players.filter(
      (p) =>
        !CONDITION_EXEMPT_NAMES.includes(p.name) &&
        !PREMIUM_PLAYERS.some((pp) => pp.name === p.name && pp.year === p.year)
    )
    if (candidates.length > 0) {
      const randomIdx = Math.floor(Math.random() * candidates.length)
      candidates[randomIdx].condition = PLAYER_CONDITIONS.HIGH
    }
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

// ==================== 후보 생성 ====================

function createEmptyTeams(numTeams: number): Team[] {
  return Array.from({ length: numTeams }, (_, i) => ({
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))
}

/**
 * 랜덤 유효 후보 1개를 생성한다.
 * 일반 선수 전체를 셔플한 뒤 라운드로빈으로 나눈다 → 팀 크기는 균등하고(총원이 팀 수로
 * 나누어떨어짐) 구성은 완전 랜덤이라 배치 공간을 폭넓게 탐색한다. 좋은 배치의 '선택'은
 * scorer(gap 밴드 → 구성 몰림)에 맡긴다. 이후 게스트 앵커 규칙(distributeGuests)을 적용한다.
 */
function generateCandidate(
  regularPlayers: Player[],
  guests: Player[],
  numTeams: number,
  playersPerTeam: number
): Team[] {
  const teams = createEmptyTeams(numTeams)

  shuffleArray(regularPlayers).forEach((player, i) => {
    teams[i % numTeams].players.push(player)
  })

  distributeGuests(teams, guests, playersPerTeam)
  return teams
}

// 점수화 전에 후보가 유효한지 검사한다: 팀 크기차<=1 + 제외쌍 분리.
function isValidCandidate(teams: Team[], excludedPairs: string[][]): boolean {
  const sizes = teams.map((t) => t.players.length)
  if (Math.max(...sizes) - Math.min(...sizes) > 1) return false

  for (const [name1, name2] of excludedPairs) {
    const sameTeam = teams.some((team) => {
      const names = team.players.map((p) => p.name)
      return names.includes(name1) && names.includes(name2)
    })
    if (sameTeam) return false
  }
  return true
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

  console.log(`Balance Gap: ${strengthGap(teams)}`)
}

// ==================== 메인 함수 ====================

export function balanceTeams(players: Player[], mode: MatchFormatType): Team[] {
  assertValidMode(mode)
  assertUniquePlayerIds(players)
  const { numTeams, playersPerTeam, expectedTotal } = parseMode(mode)

  if (players.length !== expectedTotal) {
    throw new Error(`Invalid player count for ${mode}: expected ${expectedTotal}, received ${players.length}`)
  }

  const regularPlayers = players.filter((p) => !p.isGuest)
  const guests = players.filter((p) => p.isGuest)

  // K개 랜덤 유효 후보 생성 → 규칙 강제 → 유효성 필터 → 점수화
  const pool: { teams: Team[]; score: ArrangementScore }[] = []
  for (let k = 0; k < CANDIDATE_COUNT; k++) {
    const teams = generateCandidate(regularPlayers, guests, numTeams, playersPerTeam)
    enforceExcludedPairs(teams, EXCLUDED_PAIRS)
    if (!isValidCandidate(teams, EXCLUDED_PAIRS)) continue
    pool.push({ teams, score: scoreArrangement(teams) })
  }

  // 모든 후보가 무효한 병리적 케이스: 최소 하나는 반환하도록 fallback (throw 하지 않음).
  // enforceExcludedPairs 는 swap 실패 시 용량 검사 없이 선수를 옮겨 크기 불변식(차<=1)을
  // 깨뜨릴 수 있으므로, 강제 결과가 유효할 때만 쓰고 아니면 강제 이전(라운드로빈이라 크기
  // 균등 보장) 후보를 쓴다. 그래야 아래 assertEqualTeamSizes 가 throw 하지 않는다.
  if (pool.length === 0) {
    const teams = generateCandidate(regularPlayers, guests, numTeams, playersPerTeam)
    const enforced = teams.map((t) => ({ ...t, players: [...t.players] }))
    enforceExcludedPairs(enforced, EXCLUDED_PAIRS)
    const chosen = isValidCandidate(enforced, EXCLUDED_PAIRS) ? enforced : teams
    pool.push({ teams: chosen, score: scoreArrangement(chosen) })
  }

  // 사전식 최선 선택 후, '동점'(같은 band + 같은 구성 몰림 점수) 후보 풀에서 랜덤 샘플 → 변동성 확보.
  // imbalance 는 정수라 동점 후보가 많고, 그 안의 선수 배치는 제각각이라 매번 다른 팀이 나온다.
  const best = pool.reduce((a, b) => (compareScore(a.score, b.score) <= 0 ? a : b))
  const nearBest = pool.filter((s) => compareScore(s.score, best.score) === 0)
  const winner = nearBest[Math.floor(Math.random() * nearBest.length)].teams

  // winner 에만 마무리 처리. 컨디션은 반드시 year-sort '이전'에 (인덱스 기반 확률 보존).
  winner.forEach(setPlayerCondition)
  winner.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  assertTeamsIntegrity(players, winner)
  assertEqualTeamSizes(winner)

  logFinalBalance(winner)

  return winner
}
