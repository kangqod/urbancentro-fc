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
