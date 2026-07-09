import { PLAYER_TIERS } from '@/entities/player/model/player'
import type { Player } from '@/entities/player/model/types'
import type { Team } from '@/entities/team/model/types'
import { TIER_WEIGHTS } from './constants'

// 티어 가중치 (에이스4/상급3/중급2/초급1). 알 수 없는 티어는 초급 취급.
export function getTierWeight(player: Player): number {
  return TIER_WEIGHTS[player.tier] ?? 1
}

// 팀 전력 점수 = 티어 가중치 합계 (밸런서 + 밸런스 정보 모달 공용)
export function calculateTeamStrength(team: Team): number {
  return team.players.reduce((total, player) => total + getTierWeight(player), 0)
}

// 팀 간 전력 합계 격차 (max - min)
export function strengthGap(teams: Team[]): number {
  const strengths = teams.map(calculateTeamStrength)
  return Math.max(...strengths) - Math.min(...strengths)
}

// 특정 티어가 팀 간에 얼마나 고르지 않게 퍼졌는지 (max count - min count).
export function tierCountSpread(teams: Team[], tier: string): number {
  const counts = teams.map((t) => t.players.filter((p) => p.tier === tier).length)
  return Math.max(...counts) - Math.min(...counts)
}

/**
 * 구성 몰림 지표 = Σ 티어가중치 × (해당 티어의 팀 간 count 격차).
 * 에이스(×4)·상급(×3) 이 한 팀에 몰릴수록 크게 벌점 → "상위 티어를 팀마다 고르게" 를 직접 인코딩한다.
 * (스펙 초안의 '팀내 표준편차' 지표는 폐기했다: 상급을 한 팀에 전부 몰아도 두 팀이 각자
 *  내부적으로 균일해지면 std 격차가 오히려 0 에 가까워져 몰림을 보상하는 맹점이 있었고,
 *  6:6 회귀 가드에서 이 맹점이 드물지 않게 재현됨을 실측으로 확인했다.)
 */
export function compositionImbalance(teams: Team[]): number {
  return (
    TIER_WEIGHTS[PLAYER_TIERS.ACE] * tierCountSpread(teams, PLAYER_TIERS.ACE) +
    TIER_WEIGHTS[PLAYER_TIERS.ADVANCED] * tierCountSpread(teams, PLAYER_TIERS.ADVANCED) +
    TIER_WEIGHTS[PLAYER_TIERS.INTERMEDIATE] * tierCountSpread(teams, PLAYER_TIERS.INTERMEDIATE) +
    TIER_WEIGHTS[PLAYER_TIERS.BEGINNER] * tierCountSpread(teams, PLAYER_TIERS.BEGINNER)
  )
}

/**
 * 상위 티어(에이스·상급) 몰림 지표. 눈에 잘 띄는 '스타' 분산만 따로 뽑아 최우선으로 방어한다.
 * (중급·초급 몰림은 체감이 약해 gap 뒤 tiebreaker 로 미룬다 — compositionImbalance 참고.)
 */
export function topTierImbalance(teams: Team[]): number {
  return (
    TIER_WEIGHTS[PLAYER_TIERS.ACE] * tierCountSpread(teams, PLAYER_TIERS.ACE) +
    TIER_WEIGHTS[PLAYER_TIERS.ADVANCED] * tierCountSpread(teams, PLAYER_TIERS.ADVANCED)
  )
}

export interface ArrangementScore {
  // 0: gap<=2, 1: gap===3 (구성 개선 시에만 허용), Infinity: gap>=4 (하드 리젝)
  band: number
  topImbalance: number
  gap: number
  imbalance: number
}

/**
 * 배치 품질 점수. 사전식(lexicographic): band → topImbalance → gap → imbalance.
 *
 * 우선순위 근거(사용자 체감 기준):
 *  1. band          — gap>=4 하드 리젝, gap 3 은 gap<=2 가 없을 때만(병리적 로스터 degrade).
 *  2. topImbalance  — 에이스·상급 몰림 방지. 스타가 한 팀에 몰리는 건 가장 눈에 띈다.
 *                     gap 보다 먼저 둬야 'gap 줄이려 상급 몰기'(실측 ~30%)를 막는다.
 *  3. gap           — 전력 격차. 예전엔 gap 0/1/2 를 동일 취급해 14 vs 12(gap 2) 가 뽑혔다.
 *                     스타 분산이 같은 배치들 중에선 격차가 가장 작은 것을 고른다.
 *  4. imbalance     — 중급·초급까지 포함한 전체 몰림. 체감이 약하므로 마지막 미세 tiebreak.
 */
export function scoreArrangement(teams: Team[]): ArrangementScore {
  const gap = strengthGap(teams)
  const band = gap <= 2 ? 0 : gap === 3 ? 1 : Number.POSITIVE_INFINITY
  return { band, topImbalance: topTierImbalance(teams), gap, imbalance: compositionImbalance(teams) }
}

// 낮을수록 좋음. band → topImbalance → gap → imbalance 순 사전식 비교(각 단계 작을수록 좋음).
export function compareScore(a: ArrangementScore, b: ArrangementScore): number {
  if (a.band !== b.band) return a.band - b.band
  if (a.topImbalance !== b.topImbalance) return a.topImbalance - b.topImbalance
  if (a.gap !== b.gap) return a.gap - b.gap
  return a.imbalance - b.imbalance
}
