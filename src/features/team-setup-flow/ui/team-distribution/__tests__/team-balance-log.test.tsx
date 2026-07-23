import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/shared/test/render'
import { PlayerClass, PLAYER_TIERS, type Team } from '@/entities'
import { TeamBalanceLog } from '../team-balance-log'

function makePlayer(name: string, tier: (typeof PLAYER_TIERS)[keyof typeof PLAYER_TIERS], isGuest = false) {
  return new PlayerClass({ id: name, name, tier, isGuest, isActiveForMatch: true })
}

const teams: Team[] = [
  { name: '팀 A', players: [makePlayer('선수1', PLAYER_TIERS.ACE), makePlayer('선수2', PLAYER_TIERS.BEGINNER)] },
  { name: '팀 B', players: [makePlayer('선수3', PLAYER_TIERS.INTERMEDIATE), makePlayer('게스트1', PLAYER_TIERS.ADVANCED, true)] }
]

describe('TeamBalanceLog', () => {
  it('teams가 있으면 버튼이 throw 없이 마운트된다', () => {
    renderWithProviders(<TeamBalanceLog teams={teams} topDogNames={new Set(['팀 A'])} />)

    expect(screen.getByRole('button', { name: '밸런스 정보' })).toBeInTheDocument()
  })

  it('teams가 비어 있으면 아무것도 렌더하지 않는다', () => {
    const { container } = renderWithProviders(<TeamBalanceLog teams={[]} topDogNames={new Set()} />)

    expect(container.querySelector('.team-balance-log-button')).not.toBeInTheDocument()
  })

  it('버튼 클릭 시 모달이 열리고 팀별 밸런스 정보가 표시된다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TeamBalanceLog teams={teams} topDogNames={new Set(['팀 A'])} />)

    await user.click(screen.getByRole('button', { name: '밸런스 정보' }))

    expect(await screen.findByText('팀 밸런스 정보')).toBeInTheDocument()
    expect(screen.getAllByText('1팀').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2팀').length).toBeGreaterThan(0)
  })
})
