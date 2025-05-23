import { create } from 'zustand'
import type { PlayerState } from './types'

interface PlayerStore extends PlayerState {
  setPlayers: (update: PlayerState['players'] | ((players: PlayerState['players']) => PlayerState['players'])) => void
  getAvailablePlayers: () => PlayerState['players']
  togglePlayerAvailability: (id: string) => void
  setSelectedPlayer: (player?: PlayerState['selectedPlayer']) => void
  resetPlayerState: () => void
}

const initialState: PlayerState = {
  players: [],
  availablePlayerCount: 0,
  selectedPlayer: null
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,
  setPlayers: (update) =>
    set((state) => {
      const players = typeof update === 'function' ? update(state.players) : update
      return {
        ...state,
        players,
        availablePlayerCount: players.filter((player) => player.isAvailable).length
      }
    }),
  getAvailablePlayers: () => {
    const state = get()
    return state.players.filter((player) => player.isAvailable)
  },
  togglePlayerAvailability: (id) =>
    set((state) => {
      const updatedPlayers = state.players.map((player) => (player.id === id ? { ...player, isAvailable: !player.isAvailable } : player))
      return {
        ...state,
        players: updatedPlayers,
        availablePlayerCount: updatedPlayers.filter((player) => player.isAvailable).length
      }
    }),
  setSelectedPlayer: (player?: PlayerState['selectedPlayer']) =>
    set((state) => {
      if (!player) return { ...state, selectedPlayer: null }
      return { ...state, selectedPlayer: player }
    }),
  resetPlayerState: () => set(initialState)
}))
