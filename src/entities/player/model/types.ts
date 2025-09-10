import { PLAYER_CONDITIONS, PLAYER_TIERS } from './player'

export interface Player {
  id: string
  name: string
  year: string
  tier: TierType
  attributes: string[]
  condition: ConditionType
  number: number
  isGuest: boolean
  isActiveForMatch: boolean
  strength?: string
  connectedPlayerIds?: string[]
}

export type TierType = (typeof PLAYER_TIERS)[keyof typeof PLAYER_TIERS]

export type ConditionType = (typeof PLAYER_CONDITIONS)[keyof typeof PLAYER_CONDITIONS]

export interface PlayerState {
  players: Player[]
  availablePlayerCount: number
  selectedPlayer: Player | null
  isOCR: boolean
}
