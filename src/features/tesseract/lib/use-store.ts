import { usePlayerStore } from '@/entities'

export function useSetPlayerState() {
  return usePlayerStore(({ checkTesseractPlayers }) => checkTesseractPlayers)
}
