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

export interface ArrangementScore {
  // 0: gap<=2 (목표), 1: gap===3 (구성 개선 시에만 허용), Infinity: gap>=4 (하드 리젝)
  band: number
  imbalance: number
}

/**
 * 배치 품질 점수. 사전식(lexicographic): band 우선, 동밴드면 compositionImbalance.
 * 이 인코딩이 스펙의 "gap 3은 gap<=2 배치가 없을 때만" 규칙을 상수 튜닝 없이 정확히 표현한다.
 * (선형 스칼라는 EPSILON<W_GAP 상수 결합에 정확성이 새어나가므로 폐기했다.)
 */
export function scoreArrangement(teams: Team[]): ArrangementScore {
  const gap = strengthGap(teams)
  const band = gap <= 2 ? 0 : gap === 3 ? 1 : Number.POSITIVE_INFINITY
  return { band, imbalance: compositionImbalance(teams) }
}

// 낮을수록 좋음. band 우선(작을수록 좋음), 동밴드면 imbalance 작을수록 좋음.
export function compareScore(a: ArrangementScore, b: ArrangementScore): number {
  if (a.band !== b.band) return a.band - b.band
  return a.imbalance - b.imbalance
}
