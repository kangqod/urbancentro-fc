import { useSelectedPlayerState } from '../lib'

export default function usePlayerDetailModal() {
  const [selectedPlayer, updateSelectedPlayer] = useSelectedPlayerState()

  function handleModalClose() {
    updateSelectedPlayer()
  }

  return {
    selectedPlayer,
    handleModalClose
  }
}
