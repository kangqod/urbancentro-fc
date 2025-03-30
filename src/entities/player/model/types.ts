import { PLAYER_CONDITIONS, PLAYER_POSITIONS } from './player'

export interface Player {
  id: string
  name: string
  year: string
  position: PositionType
  condition: ConditionType
  number: number
  isGuest: boolean
  isAvailable: boolean
}

export type PositionType = (typeof PLAYER_POSITIONS)[keyof typeof PLAYER_POSITIONS]

export type ConditionType = (typeof PLAYER_CONDITIONS)[keyof typeof PLAYER_CONDITIONS]

export interface PlayerState {
  players: Player[]
  availablePlayerCount: number
}
