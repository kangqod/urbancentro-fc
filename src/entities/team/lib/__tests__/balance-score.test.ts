import { describe, expect, it } from 'vitest'
import { PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities/player/model/player'
import type { Player } from '@/entities/player/model/types'
import type { Team } from '@/entities/team/model/types'
import {
  calculateTeamStrength,
  compareScore,
  compositionImbalance,
  scoreArrangement,
  strengthGap,
  tierCountSpread,
  topTierImbalance
} from '../balance-score'

function makePlayer(tier: (typeof PLAYER_TIERS)[keyof typeof PLAYER_TIERS]): Player {
  return {
    id: `p-${Math.random().toString(36).slice(2)}`,
    name: 'x',
    year: '1990',
    tier,
    attributes: [],
    condition: PLAYER_CONDITIONS.MID,
    number: 1,
    isGuest: false,
    isActiveForMatch: true,
    connectedPlayerIds: []
  }
}

function makeTeam(...tiers: (typeof PLAYER_TIERS)[keyof typeof PLAYER_TIERS][]): Team {
  return { name: 'T', players: tiers.map(makePlayer) }
}

const { ACE, ADVANCED, INTERMEDIATE, BEGINNER } = PLAYER_TIERS

describe('balance-score metrics', () => {
  it('calculateTeamStrength sums tier weights (4/3/2/1)', () => {
    expect(calculateTeamStrength(makeTeam(ACE, ADVANCED, INTERMEDIATE, BEGINNER))).toBe(10)
  })

  it('tierCountSpread returns max-min count of a tier across teams', () => {
    // 상급이 A팀 2명, B팀 0명 → spread 2
    const teams = [makeTeam(ADVANCED, ADVANCED, INTERMEDIATE), makeTeam(INTERMEDIATE, INTERMEDIATE, INTERMEDIATE)]
    expect(tierCountSpread(teams, ADVANCED)).toBe(2)
    // 중급은 A 1명, B 3명 → spread 2
    expect(tierCountSpread(teams, INTERMEDIATE)).toBe(2)
  })

  it('strengthGap returns max-min of team strengths', () => {
    const teams = [makeTeam(ACE, ACE), makeTeam(BEGINNER, BEGINNER)]
    expect(strengthGap(teams)).toBe(6) // 8 - 2
  })

  it('compositionImbalance penalizes high-tier clumping (weighted tier count spread)', () => {
    // 상급을 한 팀에 몰기: A[상급,상급], B[중급,중급] → 상급 spread 2 ×3 + 중급 spread 2 ×2 = 10
    const clumped = compositionImbalance([makeTeam(ADVANCED, ADVANCED), makeTeam(INTERMEDIATE, INTERMEDIATE)])
    // 고르게: A[상급,중급], B[상급,중급] → 모든 티어 spread 0 = 0
    const spread = compositionImbalance([makeTeam(ADVANCED, INTERMEDIATE), makeTeam(ADVANCED, INTERMEDIATE)])
    expect(clumped).toBe(10)
    expect(spread).toBe(0)
    expect(clumped).toBeGreaterThan(spread)
  })

  it('topTierImbalance counts only ace/advanced clumping (weighted)', () => {
    // 상급을 한 팀에 몰기(2:0) → 3×2=6. 중급/초급 몰림은 무시한다.
    const teams = [makeTeam(ADVANCED, ADVANCED, BEGINNER), makeTeam(INTERMEDIATE, INTERMEDIATE, INTERMEDIATE)]
    expect(topTierImbalance(teams)).toBe(6)
    // 에이스 1:0(×4) + 상급 1:0(×3) = 7
    expect(topTierImbalance([makeTeam(ACE, ADVANCED), makeTeam(INTERMEDIATE, INTERMEDIATE)])).toBe(7)
  })

  it('scoreArrangement maps gap to bands: <=2→0, 3→1, >=4→Infinity', () => {
    expect(scoreArrangement([makeTeam(ACE, INTERMEDIATE), makeTeam(ADVANCED, BEGINNER)]).band).toBe(0) // gap 2
    expect(scoreArrangement([makeTeam(ADVANCED, ADVANCED), makeTeam(INTERMEDIATE, BEGINNER)]).band).toBe(1) // gap 3
    expect(scoreArrangement([makeTeam(ACE, ACE), makeTeam(BEGINNER, BEGINNER)]).band).toBe(Number.POSITIVE_INFINITY) // gap 6
  })
})

describe('balance-score lexicographic comparison (band → topImbalance → gap → imbalance)', () => {
  it('band dominates everything: a gap<=2 arrangement beats a gap===3 one even if gap-3 has zero clumping', () => {
    // band 0 (gap 2) 인데 상급을 몰아 topImbalance 6
    const gap2Clumped = scoreArrangement([makeTeam(ADVANCED, ADVANCED), makeTeam(INTERMEDIATE, INTERMEDIATE)])
    // band 1 (gap 3) 인데 상급은 고르게 퍼져 topImbalance 0
    const gap3Spread = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE), makeTeam(ADVANCED, BEGINNER)])
    expect(gap2Clumped.band).toBe(0)
    expect(gap3Spread.band).toBe(1)
    expect(gap3Spread.topImbalance).toBeLessThan(gap2Clumped.topImbalance)
    // band 가 최우선이라 gap<=2 가 이긴다 (gap 3 은 gap<=2 후보가 없을 때만 쓰인다)
    expect(compareScore(gap2Clumped, gap3Spread)).toBeLessThan(0)
  })

  it('topImbalance beats gap: a star-spread arrangement wins even with a LARGER gap', () => {
    // 상급 고르게(spread 0) 지만 전력 격차 2
    const spread = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE), makeTeam(ADVANCED, BEGINNER, BEGINNER)])
    // 상급 몰림(2:0) 이지만 전력 격차 0
    const clumped = scoreArrangement([makeTeam(ADVANCED, ADVANCED), makeTeam(INTERMEDIATE, INTERMEDIATE, INTERMEDIATE)])
    expect(spread.topImbalance).toBe(0)
    expect(spread.gap).toBe(2)
    expect(clumped.topImbalance).toBe(6)
    expect(clumped.gap).toBe(0)
    // gap 이 더 커도 스타 분산이 우선 → spread 가 이긴다
    expect(compareScore(spread, clumped)).toBeLessThan(0)
  })

  it('gap breaks ties after topImbalance: smaller gap wins over lower int/beg imbalance (the 14 vs 12 fix)', () => {
    // 둘 다 상급 spread 0 (topImbalance 0). small 은 gap 0 이지만 중급/초급 몰림 큼,
    // big 은 gap 2 지만 중급/초급 몰림 작음. 그래도 gap 이 우선이라 small 이 이긴다.
    const small = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE), makeTeam(ADVANCED, BEGINNER, BEGINNER, BEGINNER, BEGINNER)])
    const big = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE, INTERMEDIATE), makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE)])
    expect(small.topImbalance).toBe(0)
    expect(big.topImbalance).toBe(0)
    expect(small.gap).toBe(0)
    expect(big.gap).toBe(2)
    expect(small.imbalance).toBeGreaterThan(big.imbalance) // small 이 중급/초급은 더 몰렸지만
    expect(compareScore(small, big)).toBeLessThan(0) // gap 이 우선이라 이긴다
  })

  it('imbalance is the final tiebreak: equal band/topImbalance/gap → lower int/beg spread wins', () => {
    const balanced = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE), makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE)])
    const clumped = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE, INTERMEDIATE), makeTeam(ADVANCED, INTERMEDIATE, BEGINNER, BEGINNER)])
    expect(balanced.band).toBe(clumped.band)
    expect(balanced.topImbalance).toBe(clumped.topImbalance)
    expect(balanced.gap).toBe(clumped.gap)
    expect(balanced.imbalance).toBeLessThan(clumped.imbalance)
    expect(compareScore(balanced, clumped)).toBeLessThan(0)
  })
})
