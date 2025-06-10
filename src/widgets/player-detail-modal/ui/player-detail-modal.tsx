import { lazy, Suspense } from 'react'
import usePlayerDetailModal from './player-detail-modal.hooks'

const PlayerModal = lazy(() => import('@/features').then((module) => ({ default: module.PlayerModal })))

export function PlayerDetailModal() {
  const { selectedPlayer, handleModalClose } = usePlayerDetailModal()

  return (
    <Suspense fallback={<></>}>
      <PlayerModal player={selectedPlayer} onClose={handleModalClose} />
    </Suspense>
  )
}
