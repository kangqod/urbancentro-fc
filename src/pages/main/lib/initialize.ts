import { DEFAULT_ATTRIBUTES, DEFAULT_CONDITION, DEFAULT_STRENGTH, DEFAULT_TIER, DEFAULT_YEAR, PlayerClass } from '@/entities'
import type { ConditionType, Player, TierType } from '@/entities'
import playerData from '@/shared/assets/data.json'

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
      const playerInfo = playerData.find((player) => {
        return player.name === playerName && player.year.slice(-2) === year
      })
      if (playerInfo) {
        return new PlayerClass({
          id: `shared-${teamIndex}-${playerInfo.name}`,
          name: playerInfo.name,
          number: playerInfo.number,
          year: playerInfo.year,
          tier: playerInfo.tier as TierType,
          strength: playerInfo.strength,
          attributes: playerInfo.attributes,
          condition: (condition || DEFAULT_CONDITION) as ConditionType,
          isGuest: false,
          isAvailable: true
        })
      }

      // 플레이어 정보가 없을 경우 기본값으로 처리
      return new PlayerClass({
        id: `shared-${teamIndex}-${name}`,
        name: playerName,
        number: 0,
        year: year || DEFAULT_YEAR,
        tier: DEFAULT_TIER,
        strength: DEFAULT_STRENGTH,
        attributes: DEFAULT_ATTRIBUTES,
        condition: (condition || DEFAULT_CONDITION) as ConditionType,
        isGuest: true,
        isAvailable: true
      })
    })
  )
}
