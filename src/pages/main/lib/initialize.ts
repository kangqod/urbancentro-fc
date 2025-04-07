import { DEFAULT_CONDITION, DEFAULT_TIER, DEFAULT_YEAR, PlayerClass } from '@/entities'
import type { ConditionType, Player } from '@/entities'

type TeamData = [string, string[]]

export const parseTeamsParam = (teamsParam: string): TeamData[] => {
  try {
    return JSON.parse(decodeURIComponent(teamsParam))
  } catch (e) {
    console.error('Failed to parse teams parameter:', e)
    return []
  }
}

export const calculateTotalPlayers = (teamsData: TeamData[]): number => {
  return teamsData.reduce((sum, team) => sum + team[1].length, 0)
}

export const createPlayersFromTeams = (teamsData: TeamData[]): Player[] => {
  return teamsData.flatMap((team: [string, string[]], teamIndex: number) =>
    team[1].map((name: string) => {
      const [year, playerName, condition] = name.split('-')
      return new PlayerClass({
        id: `shared-${teamIndex}-${name}`,
        name: playerName,
        number: 0,
        year: year || DEFAULT_YEAR,
        tier: DEFAULT_TIER,
        condition: (condition || DEFAULT_CONDITION) as ConditionType,
        isGuest: true,
        isAvailable: true
      })
    })
  )
}
