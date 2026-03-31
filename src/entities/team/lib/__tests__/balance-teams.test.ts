import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { PLAYER_CONDITIONS, PLAYER_TIERS } from '@/entities/player/model/player'
import type { Player } from '@/entities/player/model/types'
import type { Team } from '@/entities/team/model/types'
import {
  balanceAceDisadvantage,
  balanceBeginnerHeavyTeams,
  balanceTeamSize,
  balanceTeamStrength,
  balanceTeams,
  calculateTeamStrength,
  distributeGuests,
  distributeRegularPlayers,
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

  it('getMovablePlayers filters guests, connected players, and excluded tiers', () => {
    const players = [
      makePlayer({ id: 'movable', tier: PLAYER_TIERS.INTERMEDIATE }),
      makePlayer({ id: 'guest', isGuest: true }),
      makePlayer({ id: 'connected', connectedPlayerIds: ['x'] }),
      makePlayer({ id: 'ace', tier: PLAYER_TIERS.ACE })
    ]

    const result = getMovablePlayers(makeTeam('A', players), [PLAYER_TIERS.ACE])
    expect(result.map((p) => p.id)).toEqual(['movable'])
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

  it('distributeRegularPlayers fills teams and keeps ace split across teams', () => {
    const teams = [makeTeam('A'), makeTeam('B')]
    const tierMap: Record<string, Player[]> = {
      [PLAYER_TIERS.ACE]: [makePlayer({ tier: PLAYER_TIERS.ACE }), makePlayer({ tier: PLAYER_TIERS.ACE })],
      [PLAYER_TIERS.ADVANCED]: [makePlayer({ tier: PLAYER_TIERS.ADVANCED }), makePlayer({ tier: PLAYER_TIERS.ADVANCED })],
      [PLAYER_TIERS.INTERMEDIATE]: [makePlayer({ tier: PLAYER_TIERS.INTERMEDIATE }), makePlayer({ tier: PLAYER_TIERS.INTERMEDIATE })],
      [PLAYER_TIERS.BEGINNER]: [
        makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
        makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
        makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
        makePlayer({ tier: PLAYER_TIERS.BEGINNER })
      ]
    }

    distributeRegularPlayers(teams, tierMap, 5)

    expect(teams[0].players).toHaveLength(5)
    expect(teams[1].players).toHaveLength(5)

    const aceCounts = teams.map((team) => team.players.filter((player) => player.tier === PLAYER_TIERS.ACE).length)
    expect(aceCounts).toEqual([1, 1])
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

  it('distributeGuests does not throw on empty under-capacity candidate list (regression)', () => {
    const teams = [makeTeam('A', [makePlayer({ id: 'a1' })]), makeTeam('B', [makePlayer({ id: 'b1' })])]
    const connectedGuestWithoutAnchor = makePlayer({
      id: 'g1',
      isGuest: true,
      connectedPlayerIds: ['unknown-anchor']
    })

    expect(() => distributeGuests(teams, [connectedGuestWithoutAnchor], 1)).not.toThrow()
  })

  it('balanceTeamStrength reduces strength gap to within threshold', () => {
    const strongTeam = makeTeam('A', [
      makePlayer({ tier: PLAYER_TIERS.ACE }),
      makePlayer({ tier: PLAYER_TIERS.ADVANCED }),
      makePlayer({ tier: PLAYER_TIERS.ADVANCED }),
      makePlayer({ tier: PLAYER_TIERS.INTERMEDIATE })
    ])
    const weakTeam = makeTeam('B', [
      makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ tier: PLAYER_TIERS.BEGINNER })
    ])

    balanceTeamStrength([strongTeam, weakTeam], 10)

    const gap = Math.abs(calculateTeamStrength(strongTeam) - calculateTeamStrength(weakTeam))
    expect(gap).toBeLessThanOrEqual(2)
  })

  it('balanceTeamSize reduces size difference to at most 1', () => {
    const teams = [
      makeTeam('A', [makePlayer({ tier: PLAYER_TIERS.ADVANCED }), makePlayer({ tier: PLAYER_TIERS.INTERMEDIATE }), makePlayer()]),
      makeTeam('B', [makePlayer()])
    ]

    balanceTeamSize(teams)

    expect(Math.abs(teams[0].players.length - teams[1].players.length)).toBeLessThanOrEqual(1)
  })

  it('balanceAceDisadvantage swaps advanced from ace team into ace-less team', () => {
    const aceTeam = makeTeam('A', [
      makePlayer({ id: 'ace', tier: PLAYER_TIERS.ACE }),
      makePlayer({ id: 'adv', tier: PLAYER_TIERS.ADVANCED })
    ])
    const aceLessTeam = makeTeam('B', [makePlayer({ id: 'int', tier: PLAYER_TIERS.INTERMEDIATE })])

    balanceAceDisadvantage([aceTeam, aceLessTeam])

    expect(aceLessTeam.players.map((p) => p.id)).toContain('adv')
    expect(aceTeam.players.map((p) => p.id)).toContain('int')
  })

  it('balanceBeginnerHeavyTeams swaps beginner out for better tier from another team', () => {
    const beginnerHeavy = makeTeam('A', [
      makePlayer({ id: 'b1', tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ id: 'b2', tier: PLAYER_TIERS.BEGINNER }),
      makePlayer({ id: 'b3', tier: PLAYER_TIERS.BEGINNER })
    ])
    const other = makeTeam('B', [makePlayer({ id: 'int', tier: PLAYER_TIERS.INTERMEDIATE })])

    balanceBeginnerHeavyTeams([beginnerHeavy, other])

    expect(beginnerHeavy.players.some((p) => p.id === 'int')).toBe(true)
    expect(other.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length).toBeGreaterThan(0)
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
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0)

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

  it('does not throw on connected guest without anchor when all teams are full (regression)', () => {
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

    expect(() => balanceTeams(players, '5:5')).not.toThrow()
  })
})
