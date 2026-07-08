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
  tierCountSpread
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

  it('scoreArrangement maps gap to bands 0/1/Infinity', () => {
    expect(scoreArrangement([makeTeam(ACE, INTERMEDIATE), makeTeam(ADVANCED, BEGINNER)]).band).toBe(0) // gap 2
    expect(scoreArrangement([makeTeam(ADVANCED, ADVANCED), makeTeam(INTERMEDIATE, BEGINNER)]).band).toBe(1) // gap 3
    expect(scoreArrangement([makeTeam(ACE, ACE), makeTeam(BEGINNER, BEGINNER)]).band).toBe(Number.POSITIVE_INFINITY) // gap 6
  })
})

describe('balance-score lexicographic comparison (AC3)', () => {
  it('a gap<=2 arrangement ALWAYS beats a gap===3 arrangement, even when gap-3 has lower imbalance', () => {
    // band 0 후보: 구성 몰림을 일부러 나쁘게 (에이스+초급 vs 상급+중급) → gap 0, imbalance 10
    const band0 = scoreArrangement([makeTeam(ACE, BEGINNER), makeTeam(ADVANCED, INTERMEDIATE)])
    expect(band0.band).toBe(0)

    // band 1 후보: 구성 몰림이 더 낮음 (상급2 vs 상급1) → gap 3, imbalance 3
    const band1 = scoreArrangement([makeTeam(ADVANCED, ADVANCED), makeTeam(ADVANCED)])
    expect(band1.band).toBe(1)

    // band1 의 imbalance 가 더 낮아도(3 < 10) band0 이 이긴다
    expect(band1.imbalance).toBeLessThan(band0.imbalance)
    expect(compareScore(band0, band1)).toBeLessThan(0)
  })

  it('within the same band, the lower-imbalance arrangement wins', () => {
    // 둘 다 gap<=2 (band 0). 하나는 몰림(imbalance 큼), 하나는 균형(imbalance 0)
    const clumped = scoreArrangement([makeTeam(ACE, BEGINNER), makeTeam(ADVANCED, INTERMEDIATE)])
    const balanced = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE), makeTeam(ADVANCED, INTERMEDIATE)])
    expect(clumped.band).toBe(0)
    expect(balanced.band).toBe(0)
    expect(balanced.imbalance).toBeLessThan(clumped.imbalance)
    expect(compareScore(balanced, clumped)).toBeLessThan(0)
  })

  it('gap===3 is only chosen when no gap<=2 candidate exists (band ordering)', () => {
    const gap3 = scoreArrangement([makeTeam(ADVANCED, ADVANCED), makeTeam(INTERMEDIATE, BEGINNER)])
    const gap1 = scoreArrangement([makeTeam(ADVANCED, INTERMEDIATE), makeTeam(INTERMEDIATE, INTERMEDIATE)])
    expect(gap3.band).toBe(1)
    expect(gap1.band).toBe(0)
    // 후보 풀에 gap<=2 가 있으면 그게 최선이 된다
    expect(compareScore(gap1, gap3)).toBeLessThan(0)
  })
})
