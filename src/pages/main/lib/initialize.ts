import type { Player } from '@/entities'
import { buildSharedPlayer, type SharedTeam } from '@/features'

export const parseTeamsParam = (teamsParam: string): SharedTeam[] => {
  try {
    return JSON.parse(decodeURIComponent(teamsParam))
  } catch (e) {
    console.error('Failed to parse teams parameter:', e)
    return []
  }
}

export const calculateTotalPlayers = (teamsData: SharedTeam[]): number => {
  return teamsData.reduce((sum, team) => sum + team[1].length, 0)
}

export const createPlayersFromTeams = (teamsData: SharedTeam[]): Player[] => {
  return teamsData.flatMap((team, teamIndex) =>
    team[1].map((rawPlayer, playerIndex) => buildSharedPlayer(rawPlayer, `shared-${teamIndex}-${playerIndex}`))
  )
}
