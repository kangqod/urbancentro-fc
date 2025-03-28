import { DEFAULT_POSITION, DEFAULT_YEAR, TeamData } from '@/shared'
import type { Player } from '@/types'

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
    team[1].map((name: string) => ({
      id: `shared-${teamIndex}-${name}`,
      name,
      number: 0,
      isGuest: true,
      selected: true,
      year: DEFAULT_YEAR,
      position: DEFAULT_POSITION
    }))
  )
}
