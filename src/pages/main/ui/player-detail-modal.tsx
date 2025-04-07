import { lazy, Suspense } from 'react'
import { useSelectedPlayerState } from '../lib'

const PlayerModal = lazy(() => import('@/features').then((module) => ({ default: module.PlayerModal })))

export function PlayerDetailModal() {
  const [selectedPlayer, updateSelectedPlayer] = useSelectedPlayerState()

  function handleModalClose() {
    updateSelectedPlayer()
  }

  return (
    <Suspense fallback={<></>}>
      <PlayerModal player={selectedPlayer} onClose={handleModalClose} />
    </Suspense>
  )
}
