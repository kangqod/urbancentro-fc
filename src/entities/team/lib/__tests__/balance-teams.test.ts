import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities/player/model/player'
import type { Player } from '@/entities/player/model/types'
import type { Team } from '@/entities/team/model/types'
import { calculateTeamStrength, strengthGap, tierCountSpread } from '../balance-score'
import {
  balanceTeams,
  distributeGuests,
  enforceExcludedPairs,
  getMovablePlayers,
  getTeamTierCounts,
  setPlayerCondition,
  shuffleArray
} from '../balance-teams'

function makePlayer(overrides: Partial<Player> = {}): Player {
  const id = overrides.id ?? `p-${Math.random().toString(36).slice(2)}`
  const name = overrides.name ?? id

  return {
    id,
    name,
    year: overrides.year ?? '1990',
    tier: overrides.tier ?? PLAYER_TIERS.INTERMEDIATE,
    attributes: overrides.attributes ?? [],
    condition: overrides.condition ?? PLAYER_CONDITIONS.MID,
    number: overrides.number ?? 1,
    isGuest: overrides.isGuest ?? false,
    isActiveForMatch: overrides.isActiveForMatch ?? true,
    strength: overrides.strength,
    connectedPlayerIds: overrides.connectedPlayerIds ?? []
  }
}

function makeTeam(name: string, players: Player[] = []): Team {
  return { name, players }
}

function flattenIds(teams: Team[]): string[] {
  return teams.flatMap((team) => team.players.map((player) => player.id))
}

// 티어별 인원수로 로스터를 구성한다 (integration 가드 + 통계 하네스 공용).
function buildRoster(ace: number, adv: number, int: number, beg: number): Player[] {
  const players: Player[] = []
  const push = (tier: (typeof PLAYER_TIERS)[keyof typeof PLAYER_TIERS], n: number) => {
    for (let i = 0; i < n; i++) {
      players.push(makePlayer({ id: `${tier}-${i}`, name: `${tier} ${i}`, tier }))
    }
  }
  push(PLAYER_TIERS.ACE, ace)
  push(PLAYER_TIERS.ADVANCED, adv)
  push(PLAYER_TIERS.INTERMEDIATE, int)
  push(PLAYER_TIERS.BEGINNER, beg)
  return players
}

describe('balance-teams helpers', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calculateTeamStrength sums tier weights', () => {
    const team = makeTeam('A', [
      makePlayer({ tier: PLAYER_TIERS.ACE }),
      makePlayer({ tier: PLAYER_TIERS.ADVANCED }),
      makePlayer({ tier: PLAYER_TIERS.INTERMEDIATE }),
      makePlayer({ tier: PLAYER_TIERS.BEGINNER })
    ])

    expect(calculateTeamStrength(team)).toBe(10)
  })

  it('getMovablePlayers filters guests and connected players', () => {
    const players = [
      makePlayer({ id: 'movable', tier: PLAYER_TIERS.INTERMEDIATE }),
      makePlayer({ id: 'guest', isGuest: true }),
      makePlayer({ id: 'connected', connectedPlayerIds: ['x'] }),
      makePlayer({ id: 'ace', tier: PLAYER_TIERS.ACE })
    ]

    const result = getMovablePlayers(makeTeam('A', players))
    expect(result.map((p) => p.id)).toEqual(['movable', 'ace'])
  })

  it('getTeamTierCounts returns accurate tier counts', () => {
    const team = makeTeam('A', [
      makePlayer({ tier: PLAYER_TIERS.ACE }),
      makePlayer({ tier: PLAYER_TIERS.ADVANCED }),
      makePlayer({ tier: PLAYER_TIERS.INTERMEDIATE }),
      makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ isGuest: true, tier: PLAYER_TIERS.BEGINNER })
    ])

    expect(getTeamTierCounts(team)).toEqual({
      ace: 1,
      advanced: 1,
      intermediate: 1,
      beginner: 3,
      guests: 1
    })
  })

  it('shuffleArray keeps original array immutable and preserves elements', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.4)
    const input = [1, 2, 3, 4, 5]
    const output = shuffleArray(input)

    expect(randomSpy).toHaveBeenCalled()
    expect(output).toHaveLength(input.length)
    expect([...output].sort()).toEqual([...input].sort())
    expect(input).toEqual([1, 2, 3, 4, 5])
  })

  it('shuffleArray produces a near-uniform permutation distribution', () => {
    // Fisher–Yates 회귀 가드: sort(() => Math.random() - 0.5) 는 원소를 원래 위치
    // 근처에 남겨(near-identity 편향) 이 테스트를 통과하지 못한다.
    const N = 5
    const TRIALS = 20000
    const input = Array.from({ length: N }, (_, i) => i)
    // counts[element][position] = 해당 원소가 그 위치에 떨어진 횟수
    const counts: number[][] = Array.from({ length: N }, () => new Array(N).fill(0))

    for (let t = 0; t < TRIALS; t++) {
      const output = shuffleArray(input)
      output.forEach((element, position) => {
        counts[element][position]++
      })
    }

    const expected = TRIALS / N // 균일하면 각 (원소,위치) 조합은 이 값 근처여야 한다
    const tolerance = expected * 0.15 // ±15% (20000회 기준 ~10σ 여유, 사실상 비flaky)

    for (let element = 0; element < N; element++) {
      for (let position = 0; position < N; position++) {
        expect(Math.abs(counts[element][position] - expected)).toBeLessThan(tolerance)
      }
    }
  })

  it('distributeGuests places connected guests on connected team if space exists', () => {
    const anchor = makePlayer({ id: 'anchor' })
    const guest = makePlayer({ id: 'guest', isGuest: true, connectedPlayerIds: ['anchor'] })
    const teams = [makeTeam('A', [anchor]), makeTeam('B', [makePlayer({ id: 'b1' })])]

    distributeGuests(teams, [guest], 3)

    expect(teams[0].players.map((p) => p.id)).toContain('guest')
  })

  it('distributeGuests moves weakest movable player when connected team is full', () => {
    const anchor = makePlayer({ id: 'anchor', tier: PLAYER_TIERS.ACE })
    const weak = makePlayer({ id: 'weak', tier: PLAYER_TIERS.BEGINNER })
    const guest = makePlayer({ id: 'guest', isGuest: true, connectedPlayerIds: ['anchor'] })

    const teams = [makeTeam('A', [anchor, weak]), makeTeam('B', [makePlayer({ id: 'b1', tier: PLAYER_TIERS.ADVANCED })])]

    distributeGuests(teams, [guest], 2)

    expect(teams[0].players.map((p) => p.id)).toContain('guest')
    expect(teams[1].players.map((p) => p.id)).toContain('weak')
  })

  it('distributeGuests throws when connected guest has no anchor and no remaining capacity', () => {
    const teams = [makeTeam('A', [makePlayer({ id: 'a1' })]), makeTeam('B', [makePlayer({ id: 'b1' })])]
    const connectedGuestWithoutAnchor = makePlayer({
      id: 'g1',
      isGuest: true,
      connectedPlayerIds: ['unknown-anchor']
    })

    expect(() => distributeGuests(teams, [connectedGuestWithoutAnchor], 1)).toThrow('no capacity for connected guest')
  })

  it('enforceExcludedPairs separates blocked pair', () => {
    const teams = [
      makeTeam('A', [makePlayer({ name: '지원 1', id: 'j1' }), makePlayer({ name: '지원 2', id: 'j2' })]),
      makeTeam('B', [makePlayer({ name: 'swap', id: 'swap', tier: PLAYER_TIERS.INTERMEDIATE })])
    ]

    enforceExcludedPairs(teams, [['지원 1', '지원 2']])

    const sameTeam = teams.some((team) => {
      const names = team.players.map((player) => player.name)
      return names.includes('지원 1') && names.includes('지원 2')
    })

    expect(sameTeam).toBe(false)
  })

  it('setPlayerCondition keeps support/rainbow/best players from being HIGH', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.99).mockReturnValueOnce(0.99).mockReturnValueOnce(0.99).mockReturnValueOnce(0)

    const team = makeTeam('A', [
      makePlayer({ id: 'j1', name: '지원 1' }),
      makePlayer({ id: 'rainbow', name: '조용일', year: '1986' }),
      makePlayer({ id: 'best', name: '박준범', year: '1989' }),
      makePlayer({ id: 'normal', name: '일반 선수' })
    ])

    setPlayerCondition(team)

    const support = team.players.find((p) => p.id === 'j1')
    const rainbow = team.players.find((p) => p.id === 'rainbow')
    const best = team.players.find((p) => p.id === 'best')
    const normal = team.players.find((p) => p.id === 'normal')

    expect(support?.condition).not.toBe(PLAYER_CONDITIONS.HIGH)
    expect(rainbow?.condition).not.toBe(PLAYER_CONDITIONS.HIGH)
    expect(best?.condition).not.toBe(PLAYER_CONDITIONS.HIGH)
    expect(normal?.condition).toBe(PLAYER_CONDITIONS.HIGH)
  })
})

describe('balanceTeams integration', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function makePool(total: number, mode: '5:5' | '6:6' | '5:5:5', includeGuests = false): Player[] {
    const tiers = [PLAYER_TIERS.ACE, PLAYER_TIERS.ADVANCED, PLAYER_TIERS.INTERMEDIATE, PLAYER_TIERS.BEGINNER]

    return Array.from({ length: total }, (_, index) => {
      const isGuest = includeGuests && index >= total - 2
      return makePlayer({
        id: `pool-${mode}-${index}`,
        name: index === 0 ? '지원 1' : index === 1 ? '지원 2' : `선수 ${index}`,
        number: index + 1,
        year: `${1980 + (index % 20)}`,
        tier: tiers[index % tiers.length],
        isGuest,
        connectedPlayerIds: isGuest ? [`pool-${mode}-0`] : []
      })
    })
  }

  it('creates two teams of five for 5:5', () => {
    const players = makePool(10, '5:5')
    const result = balanceTeams(players, '5:5')

    expect(result).toHaveLength(2)
    expect(result.every((team) => team.players.length === 5)).toBe(true)
    expect(new Set(flattenIds(result)).size).toBe(10)
  })

  it('creates two teams of six for 6:6', () => {
    const players = makePool(12, '6:6')
    const result = balanceTeams(players, '6:6')

    expect(result).toHaveLength(2)
    expect(result.every((team) => team.players.length === 6)).toBe(true)
    expect(new Set(flattenIds(result)).size).toBe(12)
  })

  it('creates three teams of five for 5:5:5', () => {
    const players = makePool(15, '5:5:5')
    const result = balanceTeams(players, '5:5:5')

    expect(result).toHaveLength(3)
    expect(result.every((team) => team.players.length === 5)).toBe(true)
    expect(new Set(flattenIds(result)).size).toBe(15)
  })

  it('keeps guests in output and separates excluded pair', () => {
    const players = makePool(10, '5:5', true)
    const result = balanceTeams(players, '5:5')

    const allPlayers = result.flatMap((team) => team.players)
    expect(allPlayers.filter((player) => player.isGuest)).toHaveLength(2)

    const teamWithSupport1 = result.find((team) => team.players.some((player) => player.name === '지원 1'))
    const teamWithSupport2 = result.find((team) => team.players.some((player) => player.name === '지원 2'))
    expect(teamWithSupport1).toBeDefined()
    expect(teamWithSupport2).toBeDefined()
    expect(teamWithSupport1).not.toBe(teamWithSupport2)
  })

  it('keeps connected guest even when anchor is missing if mode still has capacity', () => {
    const players = makePool(10, '5:5').map((player, index) =>
      index === 0
        ? makePlayer({
            ...player,
            id: 'reg-1',
            isGuest: true,
            connectedPlayerIds: ['unknown-anchor']
          })
        : player
    )

    const result = balanceTeams(players, '5:5')
    expect(flattenIds(result)).toContain('reg-1')
  })

  it('throws when player count does not match mode capacity', () => {
    const players = makePool(9, '5:5')

    expect(() => balanceTeams(players, '5:5')).toThrow('Invalid player count')
  })

  it('throws when duplicate player ids are provided', () => {
    const players = makePool(10, '5:5')
    players[1] = makePlayer({
      ...players[1],
      id: players[0].id
    })

    expect(() => balanceTeams(players, '5:5')).toThrow('duplicate player ids')
  })

  // 회귀 가드: 에이스 1명 + 상급이 균등 분배 가능할 때, 상급이 에이스 없는 팀으로 쏠리면 안 된다.
  it('does not clump advanced onto the ace-less team (6:6, 1 ace + 4 advanced)', () => {
    for (let run = 0; run < 200; run++) {
      const teams = balanceTeams(buildRoster(1, 4, 4, 3), '6:6')
      const aceTeam = teams.find((t) => t.players.some((p) => p.tier === PLAYER_TIERS.ACE))!
      const other = teams.find((t) => t !== aceTeam)!
      const advAce = aceTeam.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length
      const advOther = other.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length

      // 상급 4명은 2:2 로 나뉘어야 하며, 한 팀에 3명 이상 쏠리면 안 된다.
      expect(advOther).toBeLessThan(3)
      expect(advAce).toBeGreaterThan(0)
      // 전력 격차는 여전히 작게 유지된다.
      expect(Math.abs(calculateTeamStrength(aceTeam) - calculateTeamStrength(other))).toBeLessThanOrEqual(2)
    }
  })

  it('does not starve any team of advanced across three teams (6:6:6, 1 ace)', () => {
    for (let run = 0; run < 200; run++) {
      const teams = balanceTeams(buildRoster(1, 6, 8, 3), '6:6:6')
      const advCounts = teams.map((t) => t.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length)
      expect(Math.min(...advCounts)).toBeGreaterThan(0)
      const strengths = teams.map(calculateTeamStrength)
      expect(Math.max(...strengths) - Math.min(...strengths)).toBeLessThanOrEqual(2)
    }
  })
})

// ==================== 통계적 불변식 하네스 ====================
// 랜덤 알고리즘이므로 각 (모드 × 구성 프로파일)을 N회 반복해 불변식을 검증한다.
describe('balanceTeams statistical invariants', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // 팀 구성 서명(팀 순서 무시). 동일 입력 반복 시 배치 다양성을 세는 데 사용.
  function signature(teams: Team[]): string {
    return teams
      .map((t) =>
        t.players
          .map((p) => p.id)
          .sort()
          .join(',')
      )
      .sort()
      .join('|')
  }

  interface StatCase {
    label: string
    mode: '5:5' | '6:6' | '7:7' | '5:5:5' | '6:6:6' | '5:5:5:5'
    roster: [number, number, number, number]
    gapMax: number // roster-aware: 달성 가능한 최대 격차 상한
  }

  // 균형 잡힌 프로파일: gap<=2 달성 가능. 구조적 하드 프로파일: gap<=2 불가 → gap<=3.
  const cases: StatCase[] = [
    { label: 'balanced 5:5', mode: '5:5', roster: [1, 2, 4, 3], gapMax: 2 },
    { label: 'balanced 6:6', mode: '6:6', roster: [1, 3, 5, 3], gapMax: 2 },
    { label: 'balanced 5:5:5', mode: '5:5:5', roster: [3, 3, 6, 3], gapMax: 2 },
    { label: 'balanced 5:5:5:5', mode: '5:5:5:5', roster: [4, 4, 8, 4], gapMax: 2 },
    // 1에이스 + 대부분 초급: 모든 5/5 분할이 gap=3 강제 → gap<=2 는 산술적으로 불가능.
    { label: '1-ace mostly-beginner 5:5 (gap<=2 impossible)', mode: '5:5', roster: [1, 0, 0, 9], gapMax: 3 }
  ]

  const RUNS = 80

  cases.forEach((c) => {
    it(`[${c.label}] keeps gap<=${c.gapMax}, no ace/advanced clumping, and equal sizes over ${RUNS} runs`, () => {
      for (let run = 0; run < RUNS; run++) {
        const teams = balanceTeams(buildRoster(...c.roster), c.mode)

        // 팀 크기 균등
        const sizes = teams.map((t) => t.players.length)
        expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1)

        // 전력 합계 격차 (roster-aware 상한)
        expect(strengthGap(teams)).toBeLessThanOrEqual(c.gapMax)

        // 상위 티어 몰림 방지: 에이스/상급은 팀 간 최대 1명 차이로 고르게 퍼져야 한다.
        expect(tierCountSpread(teams, PLAYER_TIERS.ACE)).toBeLessThanOrEqual(1)
        expect(tierCountSpread(teams, PLAYER_TIERS.ADVANCED)).toBeLessThanOrEqual(1)

        // 모든 선수 정확히 1회
        const total = c.roster.reduce((a, b) => a + b, 0)
        expect(new Set(flattenIds(teams)).size).toBe(total)
      }
    })
  })

  it('balanced rosters achieve gap<=2 on (near) every run', () => {
    // gap<=2 달성 가능 프로파일에서 K개 후보로 실제로 밴드0 를 확보하는지 게이팅.
    let gapLe2 = 0
    const RUNS_ACHIEVE = 80
    for (let run = 0; run < RUNS_ACHIEVE; run++) {
      const teams = balanceTeams(buildRoster(1, 3, 5, 3), '6:6')
      if (strengthGap(teams) <= 2) gapLe2++
    }
    // 달성 가능하므로 압도적 다수가 gap<=2 여야 한다.
    expect(gapLe2 / RUNS_ACHIEVE).toBeGreaterThanOrEqual(0.9)
  })

  it('produces varied arrangements across repeated identical input (reshuffle variety)', () => {
    const signatures = new Set<string>()
    const RUNS_VARIETY = 60
    for (let run = 0; run < RUNS_VARIETY; run++) {
      const teams = balanceTeams(buildRoster(4, 4, 8, 4), '5:5:5:5') // 총 20명
      signatures.add(signature(teams))
    }
    // 단순 >1 이 아니라 의미 있는 다양성을 요구한다.
    expect(signatures.size).toBeGreaterThanOrEqual(5)
  })
})
