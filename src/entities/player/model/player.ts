import type { Player, ConditionType, TierType } from './types'

export const PLAYER_TIERS = {
  ACE: 'ace',
  ADVANCED: 'advanced',
  INTERMEDIATE: 'intermediate',
  BEGINNER: 'beginner'
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
export const DEFAULT_TIER = PLAYER_TIERS.INTERMEDIATE
export const DEFAULT_CONDITION = PLAYER_CONDITIONS.MID
export const DEFAULT_STRENGTH = '-'
export const DEFAULT_ATTRIBUTES: string[] = []

export class PlayerClass implements Player {
  id: string
  name: string
  year: string
  tier: TierType
  strength: string
  attributes: string[]
  condition: ConditionType
  number: number
  isGuest: boolean
  isAvailable: boolean

  constructor(data: Partial<Player>) {
    this.id = data.id || `${data.year}-${data.name}-${data.number}`
    this.name = data.name || ''
    this.year = data.year || DEFAULT_YEAR
    this.number = data.number || DEFAULT_NUMBER
    this.tier = data.tier || DEFAULT_TIER
    this.strength = data.strength || DEFAULT_STRENGTH
    this.attributes = data.attributes || DEFAULT_ATTRIBUTES
    this.condition = data.condition || DEFAULT_CONDITION
    this.isGuest = data.isGuest || false
    this.isAvailable = data.isAvailable ?? data.year !== DEFAULT_YEAR
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
