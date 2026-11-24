import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTeamStore } from '@/shared/test/render'
import { PlayerClass, type Team } from '@/entities'
import { useTeamDistribution } from '../team-distribution.hooks'

const makeTeams = (): Team[] => [
  { name: '팀 A', players: ['a1', 'a2'].map((id) => new PlayerClass({ id, name: id, isActiveForMatch: true })) },
  { name: '팀 B', players: ['b1', 'b2'].map((id) => new PlayerClass({ id, name: id, isActiveForMatch: true })) }
]

const teamIds = () => useTeamStore.getState().teams.map((team) => team.players.map((player) => player.id))

describe('useTeamDistribution 스왑 상태 전이', () => {
  beforeEach(() => {
    useTeamStore.setState({ teams: makeTeams() }, false)
  })

  it('기본값은 모드 OFF·선택 없음이다', () => {
    const { result } = renderHook(() => useTeamDistribution())

    expect(result.current.isSwapMode).toBe(false)
    expect(result.current.swapSelectedId).toBeNull()
  })

  it('선택 → 같은 id 재탭 해제 → 같은 팀 다른 선수 탭 시 선택 이동 → 다른 팀 탭 시 교환·해제', () => {
    const { result } = renderHook(() => useTeamDistribution())

    act(() => result.current.toggleSwapMode())
    expect(result.current.isSwapMode).toBe(true)

    act(() => result.current.handleSwapTap('a1'))
    expect(result.current.swapSelectedId).toBe('a1')

    act(() => result.current.handleSwapTap('a1'))
    expect(result.current.swapSelectedId).toBeNull()

    act(() => result.current.handleSwapTap('a1'))
    act(() => result.current.handleSwapTap('a2'))
    expect(result.current.swapSelectedId).toBe('a2')
    expect(teamIds()).toEqual([
      ['a1', 'a2'],
      ['b1', 'b2']
    ])

    act(() => result.current.handleSwapTap('b1'))
    expect(result.current.swapSelectedId).toBeNull()
    expect(teamIds()).toEqual([
      ['a1', 'b1'],
      ['a2', 'b2']
    ])
  })

  it('모드 OFF 토글 시 선택이 해제된다', () => {
    const { result } = renderHook(() => useTeamDistribution())

    act(() => result.current.toggleSwapMode())
    act(() => result.current.handleSwapTap('b2'))
    expect(result.current.swapSelectedId).toBe('b2')

    act(() => result.current.toggleSwapMode())
    expect(result.current.isSwapMode).toBe(false)
    expect(result.current.swapSelectedId).toBeNull()
  })

  it('다시 섞기(handleDistributePlayers) 시작 시 모드·선택이 초기화된다', async () => {
    const { result } = renderHook(() => useTeamDistribution())

    act(() => result.current.toggleSwapMode())
    act(() => result.current.handleSwapTap('a1'))

    await act(async () => {
      await result.current.handleDistributePlayers()
    })

    expect(result.current.isSwapMode).toBe(false)
    expect(result.current.swapSelectedId).toBeNull()
  })
})
