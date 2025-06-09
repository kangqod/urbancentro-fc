import { create } from 'zustand'
import type { Player, PlayerState } from './types'

interface PlayerStore extends PlayerState {
  setPlayers: (update: PlayerState['players'] | ((players: PlayerState['players']) => PlayerState['players'])) => void
  getAvailablePlayers: () => PlayerState['players']
  togglePlayerAvailability: (id: string) => void
  setSelectedPlayer: (player?: PlayerState['selectedPlayer']) => void
  resetPlayerState: () => void
  checkTesseractPlayers: (playerList: Pick<Player, 'name' | 'year'>[]) => void
}

const initialState: PlayerState = {
  players: [],
  availablePlayerCount: 0,
  selectedPlayer: null,
  isOCR: false
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
  checkTesseractPlayers: (playerList: Pick<Player, 'name' | 'year'>[]) =>
    set((state) => {
      const updatedPlayers = state.players.map((player) => {
        if (!state.isOCR) {
          // OCR이 처음 실행될 때: playerList에 포함된 선수만 true, 나머지는 false
          return {
            ...player,
            isAvailable: playerList.some((p) => p.name === player.name && p.year === player.year)
          }
        } else {
          // 이미 OCR이 실행된 상태: 기존에 true였던 값은 유지, 새로 true로 바뀌는 것만 반영
          const shouldBeAvailable = playerList.some((p) => p.name === player.name && p.year === player.year)
          return {
            ...player,
            isAvailable: player.isAvailable || shouldBeAvailable
          }
        }
      })
      return {
        ...state,
        players: updatedPlayers,
        availablePlayerCount: updatedPlayers.filter((p) => p.isAvailable).length,
        isOCR: true
      }
    }),
  resetPlayerState: () => set(initialState)
}))
