import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, useTeamStore, usePlayerStore } from '@/shared/test/render'
import { PlayerClass, PLAYER_TIERS, type Team } from '@/entities'
import { Container } from '../container'

const teams: Team[] = [
  { name: '팀 A', players: [new PlayerClass({ id: 'p1', name: '선수1', tier: PLAYER_TIERS.ACE, isActiveForMatch: true })] },
  { name: '팀 B', players: [new PlayerClass({ id: 'p2', name: '선수2', tier: PLAYER_TIERS.BEGINNER, isActiveForMatch: true })] }
]

describe('Container', () => {
  it('teams가 있으면 팀 카드 Row가 throw 없이 마운트되고 기대 텍스트가 존재한다', () => {
    useTeamStore.setState({ teams }, false)

    const { container } = renderWithProviders(<Container isShuffle={false} />)

    expect(screen.getByText('선수1')).toBeInTheDocument()
    expect(screen.getByText('선수2')).toBeInTheDocument()
    const titles = Array.from(container.querySelectorAll('.team-card-title')).map((el) => el.textContent)
    expect(titles.some((t) => t?.includes('1') && t?.includes('팀'))).toBe(true)
    expect(titles.some((t) => t?.includes('2') && t?.includes('팀'))).toBe(true)
  })

  it('선수 카드를 클릭하면 selectedPlayer 상태가 갱신된다', async () => {
    useTeamStore.setState({ teams }, false)

    renderWithProviders(<Container isShuffle={false} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('선수1'))

    expect(usePlayerStore.getState().selectedPlayer?.name).toBe('선수1')
  })

  it('스왑 모드에서 선수를 탭하면 onSwapTap(id)을 호출하고 selectedPlayer는 바뀌지 않는다', async () => {
    useTeamStore.setState({ teams }, false)
    const onSwapTap = vi.fn()

    renderWithProviders(<Container isShuffle={false} swapMode swapSelectedId={null} onSwapTap={onSwapTap} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('선수1'))

    expect(onSwapTap).toHaveBeenCalledWith('p1')
    expect(usePlayerStore.getState().selectedPlayer).toBeNull()
  })

  it('swapSelectedId와 일치하는 선수 항목에 is-swap-selected, 팀 Row에 is-swap-mode 클래스가 붙는다', () => {
    useTeamStore.setState({ teams }, false)

    const { container } = renderWithProviders(<Container isShuffle={false} swapMode swapSelectedId="p1" onSwapTap={vi.fn()} />)

    expect(container.querySelector('.team-row.is-swap-mode')).not.toBeNull()
    const selected = container.querySelectorAll('.player-item.is-swap-selected')
    expect(selected).toHaveLength(1)
    expect(selected[0].textContent).toContain('선수1')
  })

  it('스왑 토글이 있으면 모드 OFF에선 자리 바꾸기 버튼만 보이고 배너는 없다', async () => {
    useTeamStore.setState({ teams }, false)
    const onToggle = vi.fn()

    renderWithProviders(<Container isShuffle={false} onToggleSwapMode={onToggle} />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /자리 바꾸기/ }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('스왑 모드 배너는 선택 전엔 안내를, 선택 후엔 선택 선수 이름을 보여주고 대상 표시를 붙인다', () => {
    const swapTeams: Team[] = [
      {
        name: '팀 A',
        players: [
          new PlayerClass({ id: 'p1', name: '선수1', tier: PLAYER_TIERS.ACE, isActiveForMatch: true }),
          new PlayerClass({ id: 'p3', name: '선수3', tier: PLAYER_TIERS.ACE, isActiveForMatch: true })
        ]
      },
      teams[1]
    ]
    useTeamStore.setState({ teams: swapTeams }, false)

    const { rerender, container } = renderWithProviders(
      <Container isShuffle={false} swapMode swapSelectedId={null} onSwapTap={vi.fn()} onToggleSwapMode={vi.fn()} />
    )
    expect(screen.getByRole('status')).toHaveTextContent('바꿀 선수를 먼저 탭하세요')
    expect(screen.getByRole('button', { name: /완료/ })).toHaveAttribute('aria-pressed', 'true')

    rerender(<Container isShuffle={false} swapMode swapSelectedId="p1" onSwapTap={vi.fn()} onToggleSwapMode={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('선수1 ↔ 다른 팀 선수를 탭하세요')

    const targetOf = (name: string) =>
      Array.from(container.querySelectorAll('.player-item'))
        .find((el) => el.textContent?.includes(name))
        ?.getAttribute('data-swap-target')
    expect(targetOf('선수1')).toBeNull()
    expect(targetOf('선수3')).toBe('same')
    expect(targetOf('선수2')).toBe('other')
  })
})
