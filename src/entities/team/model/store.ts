import { create } from 'zustand'
import type { TeamState } from './types'

interface TeamStore extends TeamState {
  setTeamOption: (teamCount: number, playersPerTeam: number) => void
  setTeams: (teams: TeamState['teams']) => void
  resetTeamState: () => void
}

const initialState: TeamState = {
  teams: [],
  teamCount: 0,
  playersPerTeam: 0,
  requiredPlayers: 0
}

export const useTeamStore = create<TeamStore>((set) => ({
  ...initialState,

  setTeamOption: (teamCount: number, playersPerTeam: number) =>
    set(() => ({
      teamCount,
      playersPerTeam,
      requiredPlayers: teamCount * playersPerTeam
    })),

  setTeams: (teams) =>
    set(() => ({
      teams
    })),

  resetTeamState: () => set(initialState)
}))
