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

export type PositionType = 'forward' | 'midfielder' | 'defender'

export type ConditionType = 'high' | 'midhigh' | 'mid' | 'midlow' | 'low'

export interface PlayerState {
  players: Player[]
  availablePlayerCount: number
}
