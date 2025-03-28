import { create } from 'zustand'
import { Player } from '@/entities/player'
import type { TeamState } from './types'

interface TeamStore extends TeamState {
  setTeamOption: (teamCount: number, playersPerTeam: number) => void
  createTeams: (count: number) => void
  updateSelectedPlayers: (selectedPlayers: Player[]) => void
  resetTeamState: () => void
}

const initialState: TeamState = {
  playersPerTeam: 0,
  requiredPlayers: 0,
  selectedPlayers: [],
  teamCount: 0,
  teams: []
}

export const useTeamStore = create<TeamStore>((set) => ({
  ...initialState,

  setTeamOption: (teamCount: number, playersPerTeam: number) =>
    set(() => ({
      teamCount,
      requiredPlayers: teamCount * playersPerTeam
    })),

  createTeams: (count) =>
    set((state) => ({
      teams: Array.from({ length: count }, (_, index) => ({
        id: `team-${index + 1}`,
        name: `팀 ${index + 1}`,
        players: []
      })),
      teamCount: count,
      requiredPlayers: state.playersPerTeam * count
    })),

  updateSelectedPlayers: (selectedPlayers: Player[]) => {
    set(() => ({
      selectedPlayers
    }))
  },

  resetTeamState: () => set(initialState)
}))
