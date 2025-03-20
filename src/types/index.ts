import { PLAYER_POSITIONS, MATCH_FORMAT_CONFIG } from '@/constants'

export interface KakaoWindow extends Window {
  Kakao: any
}

export type Player = {
  id: string
  year: string
  name: string
  position: string
  number?: number
  isGuest?: boolean
  isParticipating?: boolean
}

export interface Team {
  id: string
  name: string
  players: Player[]
}

export type PositionType = (typeof PLAYER_POSITIONS)[keyof typeof PLAYER_POSITIONS]

export type MatchFormatConfigKey = keyof typeof MATCH_FORMAT_CONFIG

export type MatchFormatConfig = (typeof MATCH_FORMAT_CONFIG)[MatchFormatConfigKey]

export type MatchFormatType = (typeof MATCH_FORMAT_CONFIG)[MatchFormatConfigKey]['ID']

export interface ShareKakaoContent {
  description: string
  teams: Team[]
}
