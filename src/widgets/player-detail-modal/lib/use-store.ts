import { useShallow } from 'zustand/react/shallow'
import { usePlayerStore } from '@/entities'
import type { Player, PlayerState } from '@/entities'

export function useSelectedPlayerState(): [Player | null, (player?: PlayerState['selectedPlayer']) => void] {
  return usePlayerStore(useShallow(({ selectedPlayer, setSelectedPlayer }) => [selectedPlayer, setSelectedPlayer]))
}
