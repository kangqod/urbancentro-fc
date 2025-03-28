import type { Player } from '@/entities/player/model/types'
import { MATCH_FORMAT_CONFIG } from '../lib/constants'

export interface Team {
  name: string
  players: Player[]
}

export interface TeamState {
  teams: Team[]
  teamCount: number
  playersPerTeam: number
  requiredPlayers: number
}

export type MatchFormatConfigKey = keyof typeof MATCH_FORMAT_CONFIG

export type MatchFormatConfig = (typeof MATCH_FORMAT_CONFIG)[MatchFormatConfigKey]

export type MatchFormatType = (typeof MATCH_FORMAT_CONFIG)[MatchFormatConfigKey]['ID']

export interface ShareKakaoContent {
  description: string
  teams: Team[]
}
