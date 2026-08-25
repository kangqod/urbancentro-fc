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
  // 시트 '프리미엄' 열. 카드 강조 이펙트·탑독 가중·HIGH 컨디션 면제에 쓰인다.
  isPremium?: boolean
}

export type TierType = (typeof PLAYER_TIERS)[keyof typeof PLAYER_TIERS]

export type ConditionType = (typeof PLAYER_CONDITIONS)[keyof typeof PLAYER_CONDITIONS]

export interface PlayerState {
  players: Player[]
  availablePlayerCount: number
  selectedPlayer: Player | null
  isOCR: boolean
}

// 시트 CSV 파싱 결과(및 localStorage 캐시) 행 형태. PlayerClass 생성 전 원본 로스터 단위.
export interface RosterRow {
  year: string
  number: number
  name: string
  tier: TierType
  strength: string
  attributes: string[]
  isPremium: boolean
}

// cached = 원격 실패 후 localStorage의 마지막 성공분 사용, error = 쓸 명단이 전혀 없음(서비스 차단)
export type RosterStatus = 'loading' | 'remote' | 'cached' | 'error'
