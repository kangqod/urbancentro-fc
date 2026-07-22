import { PLAYER_TIERS } from '@/entities/player/model/player'

export const MATCH_FORMAT_CONFIG = {
  FIVE_TWO_TEAMS: {
    ID: '5:5',
    TITLE: '5 vs 5',
    DESCRIPTION: '총 10명',
    TEAM_COUNT: 2,
    PLAYERS_PER_TEAM: 5
  },
  SIX_TWO_TEAMS: {
    ID: '6:6',
    TITLE: '6 vs 6',
    DESCRIPTION: '총 12명',
    TEAM_COUNT: 2,
    PLAYERS_PER_TEAM: 6
  },
  SEVEN_TWO_TEAMS: {
    ID: '7:7',
    TITLE: '7 vs 7',
    DESCRIPTION: '총 14명',
    TEAM_COUNT: 2,
    PLAYERS_PER_TEAM: 7
  },
  FOUR_THREE_TEAMS: {
    ID: '4:4:4',
    TITLE: '4 vs 4 vs 4',
    DESCRIPTION: '총 12명',
    TEAM_COUNT: 3,
    PLAYERS_PER_TEAM: 4
  },
  FIVE_THREE_TEAMS: {
    ID: '5:5:5',
    TITLE: '5 vs 5 vs 5',
    DESCRIPTION: '총 15명',
    TEAM_COUNT: 3,
    PLAYERS_PER_TEAM: 5
  },
  SIX_THREE_TEAMS: {
    ID: '6:6:6',
    TITLE: '6 vs 6 vs 6',
    DESCRIPTION: '총 18명',
    TEAM_COUNT: 3,
    PLAYERS_PER_TEAM: 6
  },
  SEVEN_THREE_TEAMS: {
    ID: '7:7:7',
    TITLE: '7 vs 7 vs 7',
    DESCRIPTION: '총 21명',
    TEAM_COUNT: 3,
    PLAYERS_PER_TEAM: 7
  },
  FOUR_FOUR_TEAMS: {
    ID: '4:4:4:4',
    TITLE: '4 vs 4 vs 4 vs 4',
    DESCRIPTION: '총 16명',
    TEAM_COUNT: 4,
    PLAYERS_PER_TEAM: 4
  },
  FIVE_FOUR_TEAMS: {
    ID: '5:5:5:5',
    TITLE: '5 vs 5 vs 5 vs 5',
    DESCRIPTION: '총 20명',
    TEAM_COUNT: 4,
    PLAYERS_PER_TEAM: 5
  }
} as const

export const RAINBOW_PLAYERS = [
  { name: '조용일', year: '1986' },
  { name: '박근휘', year: '1989' }
]

export const BEST_PLAYERS = [{ name: '박준범', year: '1989' }]

// 같은 팀에 두면 안 되는 선수 쌍 (밸런서가 다른 팀으로 분리한다)
export const EXCLUDED_PAIRS: string[][] = [['지원 1', '지원 2']]

// 컨디션(HIGH) 부여에서 제외할 선수 이름 ('지원' 성격의 인원)
export const CONDITION_EXEMPT_NAMES = ['지원 1', '지원 2']

export const TIER_WEIGHTS = {
  [PLAYER_TIERS.ACE]: 4,
  [PLAYER_TIERS.ADVANCED]: 3,
  [PLAYER_TIERS.INTERMEDIATE]: 2,
  [PLAYER_TIERS.BEGINNER]: 1
} as const
