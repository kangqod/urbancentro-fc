import { TeamSetupFlow } from '@/features'
import { PlayerDetailModal } from './player-detail-modal'
import { useTeamContainer } from './container.hooks'

export function Container() {
  useTeamContainer()

  return (
    <>
      <TeamSetupFlow />
      <PlayerDetailModal />
    </>
  )
}
