import type { Player, ConditionType, TierType } from './types'

export const PLAYER_TIERS = {
  ACE: '에이스',
  ADVANCED: '상급',
  INTERMEDIATE: '중급',
  BEGINNER: '초급'
} as const

export const PLAYER_CONDITIONS = {
  HIGH: 'high',
  MID_HIGH: 'midhigh',
  MID: 'mid',
  MID_LOW: 'midlow',
  LOW: 'low'
} as const

export const DEFAULT_YEAR = '3000'
export const DEFAULT_NUMBER = 99
export const DEFAULT_TIER = PLAYER_TIERS.INTERMEDIATE

export const TIER_LABELS: Record<TierType, string> = {
  [PLAYER_TIERS.ACE]: '에이스',
  [PLAYER_TIERS.ADVANCED]: '상급',
  [PLAYER_TIERS.INTERMEDIATE]: '중급',
  [PLAYER_TIERS.BEGINNER]: '초급'
}

const VALID_TIERS = new Set(Object.values(PLAYER_TIERS))
export const toTierType = (value: string | undefined): TierType =>
  value !== undefined && VALID_TIERS.has(value as TierType) ? (value as TierType) : DEFAULT_TIER
export const DEFAULT_CONDITION = PLAYER_CONDITIONS.MID
export const DEFAULT_STRENGTH = ''
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
  isActiveForMatch: boolean
  connectedPlayerIds?: string[]

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
    this.isActiveForMatch = data.isActiveForMatch ?? data.year !== DEFAULT_YEAR
    this.connectedPlayerIds = data.connectedPlayerIds || []
  }

  static createFromData(data: Partial<Player>): PlayerClass {
    return new PlayerClass(data)
  }

  toggleSelection(): void {
    this.isActiveForMatch = !this.isActiveForMatch
  }

  updateCondition(condition: ConditionType): void {
    this.condition = condition
  }
}
