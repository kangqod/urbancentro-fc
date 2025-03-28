import { TAB_KEYS, PLAYER_CONDITIONS } from '../constants'

export type TabKeys = (typeof TAB_KEYS)[keyof typeof TAB_KEYS]

export type ConditionType = (typeof PLAYER_CONDITIONS)[keyof typeof PLAYER_CONDITIONS]

export type Player = {
  id: string
  year: string
  name: string
  position: string
  condition?: ConditionType
  number?: number
  isGuest?: boolean
  isParticipating?: boolean
}

export type TeamData = [string, string[]]
