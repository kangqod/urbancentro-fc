import { create } from 'zustand'
import type { Player, PlayerState } from './types'

interface PlayerStore extends PlayerState {
  availablePlayerCount: number
  setPlayers: (players: Player[]) => void
  togglePlayerAvailability: (id: string) => void
  resetPlayerState: () => void
}

const initialState: PlayerState = {
  players: []
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,
  availablePlayerCount: 0,
  setPlayers: (players) =>
    set({
      players,
      availablePlayerCount: players.filter((player) => player.isAvailable).length // 업데이트
    }),
  togglePlayerAvailability: (id) =>
    set((state) => {
      const updatedPlayers = state.players.map((player) => (player.id === id ? { ...player, isAvailable: !player.isAvailable } : player))
      return {
        players: updatedPlayers,
        availablePlayerCount: updatedPlayers.filter((player) => player.isAvailable).length // 업데이트
      }
    }),
  resetPlayerState: () => set(initialState)
}))
