export const PRIMARY_COLOR = '#ff681f'

export const TAB_KEYS = {
  TEAM_SETUP: 'team-setup',
  PLAYER_SELECTION: 'player-selection',
  TEAM_DISTRIBUTION: 'team-distribution'
} as const

export const MATCH_FORMAT_CONFIG = {
  FIVE_TWO_TEAMS: {
    ID: '5:5',
    TITLE: '5 vs 5',
    DESCRIPTION: '총 10명',
    TEAMS: 2,
    PLAYERS_PER_TEAM: 5
  },
  SIX_TWO_TEAMS: {
    ID: '6:6',
    TITLE: '6 vs 6',
    DESCRIPTION: '총 12명',
    TEAMS: 2,
    PLAYERS_PER_TEAM: 6
  },
  SEVEN_TWO_TEAMS: {
    ID: '7:7',
    TITLE: '7 vs 7',
    DESCRIPTION: '총 14명',
    TEAMS: 2,
    PLAYERS_PER_TEAM: 7
  },
  FIVE_THREE_TEAMS: {
    ID: '5:5:5',
    TITLE: '5 vs 5 vs 5',
    DESCRIPTION: '총 15명',
    TEAMS: 3,
    PLAYERS_PER_TEAM: 5
  },
  SIX_THREE_TEAMS: {
    ID: '6:6:6',
    TITLE: '6 vs 6 vs 6',
    DESCRIPTION: '총 18명',
    TEAMS: 3,
    PLAYERS_PER_TEAM: 6
  },
  SEVEN_THREE_TEAMS: {
    ID: '7:7:7',
    TITLE: '7 vs 7 vs 7',
    DESCRIPTION: '총 21명',
    TEAMS: 3,
    PLAYERS_PER_TEAM: 7
  }
} as const

export const PLAYER_POSITIONS = {
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

export const DEFAULT_POSITION = PLAYER_POSITIONS.MIDFIELDER

export const DEFAULT_CONDITION = PLAYER_CONDITIONS.MID

export const DEFAULT_YEAR = '2099'
