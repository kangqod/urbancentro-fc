import { DEFAULT_CONDITION, DEFAULT_TIER, PLAYER_CONDITIONS, PlayerClass } from '@/entities'
import type { ConditionType, Team } from '@/entities'

export function getSelectionStatus(count: number, requiredPlayers: number) {
  if (count === 0) {
    return { type: 'warning', message: `${requiredPlayers}명의 선수를 선택해주세요` }
  } else if (count < requiredPlayers) {
    return { type: 'warning', message: `${requiredPlayers - count}명이 더 필요합니다` }
  } else if (count > requiredPlayers) {
    return { type: 'error', message: `${count - requiredPlayers}명이 초과되었습니다` }
  } else {
    return { type: 'success', message: '인원이 맞습니다' }
  }
}

export function getTeamsText(teams: Team[]) {
  return teams
    .map((team) => {
      const playerList = team.players
        .map((p) => `${p.year ? `${p.year.slice(-2)}` : '99'} ${p.name} ${p.condition === PLAYER_CONDITIONS.HIGH ? '↑' : ''}`)
        .join('\n')
      return `${team.name}\n${playerList}`
    })
    .join('\n\n')
}

export function parseSharedTeams(teamsParam: string | null): Team[] | null {
  if (!teamsParam) throw new Error('팀 데이터를 불러오는데 실패했습니다.')

  try {
    const decodedTeams = JSON.parse(teamsParam)
    const formattedTeams: Team[] = decodedTeams.map((team: [string, string[]], index: number) => ({
      id: String(index + 1),
      name: `팀 ${team[0]}`,
      players: team[1].map((player, playerIndex) => {
        const [year, name, condition] = player.split('-')
        return new PlayerClass({
          id: `shared-${index}-${playerIndex}`,
          name,
          year,
          tier: DEFAULT_TIER,
          condition: (condition || DEFAULT_CONDITION) as ConditionType,
          isGuest: true,
          isAvailable: true
        })
      })
    }))
    return formattedTeams
  } catch (error) {
    throw new Error('팀 데이터를 불러오는데 실패했습니다.')
  }
}
