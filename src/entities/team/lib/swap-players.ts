import type { Team } from '../model/types'

function findPlayerPosition(teams: Team[], id: string) {
  for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
    const playerIndex = teams[teamIndex].players.findIndex((player) => player.id === id)
    if (playerIndex !== -1) return { teamIndex, playerIndex }
  }
  return null
}

// 같은 팀·미존재 id·동일 id는 입력 참조를 그대로 반환한다 — 호출부가 참조 비교로 "교환 안 됨"을 판정한다.
export function swapPlayers(teams: Team[], idA: string, idB: string): Team[] {
  if (idA === idB) return teams

  const a = findPlayerPosition(teams, idA)
  const b = findPlayerPosition(teams, idB)
  if (!a || !b || a.teamIndex === b.teamIndex) return teams

  const playerA = teams[a.teamIndex].players[a.playerIndex]
  const playerB = teams[b.teamIndex].players[b.playerIndex]

  return teams.map((team, teamIndex) => {
    if (teamIndex === a.teamIndex) {
      return { ...team, players: team.players.map((player, i) => (i === a.playerIndex ? playerB : player)) }
    }
    if (teamIndex === b.teamIndex) {
      return { ...team, players: team.players.map((player, i) => (i === b.playerIndex ? playerA : player)) }
    }
    return team
  })
}
