import type { Player } from '@/entities/player/model/types'

export interface Team {
  name: string
  players: Player[]
}

export interface TeamState {
  playersPerTeam: number
  requiredPlayers: number
  selectedPlayers: Player[]
  teamCount: number
  teams: Team[]
}
