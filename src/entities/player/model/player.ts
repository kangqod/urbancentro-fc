import type { Player, ConditionType, PositionType } from './types'

export const PLAYER_POSITIONS = {
  ACE: 'ace',
  FORWARD: 'forward',
  MIDFIELDER: 'midfielder',
  DEFENDER: 'defender'
} as const

export const PLAYER_CONDITIONS = {
  HIGH: 'high',
  MID_HIGH: 'midhigh',
  MID: 'mid',
  MID_LOW: 'midlow',
  LOW: 'low'
} as const

export const DEFAULT_YEAR = '2099'
export const DEFAULT_NUMBER = 99
export const DEFAULT_POSITION = PLAYER_POSITIONS.MIDFIELDER
export const DEFAULT_CONDITION = PLAYER_CONDITIONS.MID

export class PlayerClass implements Player {
  id: string
  name: string
  year: string
  position: PositionType
  condition: ConditionType
  number: number
  isGuest: boolean
  isAvailable: boolean

  constructor(data: Partial<Player>) {
    this.id = data.id || `${data.year}-${data.name}-${data.number}`
    this.name = data.name || ''
    this.year = data.year || DEFAULT_YEAR
    this.number = data.number || DEFAULT_NUMBER
    this.position = data.position || DEFAULT_POSITION
    this.condition = data.condition || DEFAULT_CONDITION
    this.isGuest = data.isGuest || false
    this.isAvailable = data.year !== DEFAULT_YEAR
  }

  static createFromData(data: Partial<Player>): PlayerClass {
    return new PlayerClass(data)
  }

  toggleSelection(): void {
    this.isAvailable = !this.isAvailable
  }

  updateCondition(condition: ConditionType): void {
    this.condition = condition
  }
}
