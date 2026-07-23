import { describe, it, expect } from 'vitest'
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
})
