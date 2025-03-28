import { PLAYER_CONDITIONS, PLAYER_POSITIONS } from '@/entities'
import type { Player, Team, MatchFormatType } from '@/entities'

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function setPlayerCondition(team: Team) {
  team.players.forEach((player) => {
    player.condition = PLAYER_CONDITIONS.MID
  })

  const lastIndex = team.players.length - 1
  for (let i = 0; i <= lastIndex; i++) {
    if (i === 0 || i === lastIndex) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
      continue
    }
    const probability = i === 1 ? 0.7 : i === 2 ? 0.5 : 0.02
    if (Math.random() < probability) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
    }
  }
}

function ensurePlayerSeparation(teams: Team[], excludedPairs: string[][]) {
  excludedPairs.forEach(([player1Name, player2Name]) => {
    let player1Team: Team | undefined
    let player2Team: Team | undefined

    for (const team of teams) {
      if (team.players.some((p) => p.name === player1Name)) player1Team = team
      if (team.players.some((p) => p.name === player2Name)) player2Team = team
    }

    if (player1Team && player2Team && player1Team === player2Team) {
      // 두 선수가 같은 팀에 있다면 강제로 분리 (ex. 지원, 지원 2)

      const targetTeam = teams.find((team) => team !== player1Team)

      if (targetTeam) {
        const player2 = player2Team.players.find((p) => p.name === player2Name)
        if (player2) {
          player1Team.players = player1Team.players.filter((p) => p.name !== player2Name)
          targetTeam.players.push(player2)
        }
        // targetTeam에서 미드필더 한 명을 player1Team으로 이동
        const midfielder = targetTeam.players.find((p) => p.position === PLAYER_POSITIONS.MIDFIELDER)
        if (midfielder) {
          targetTeam.players = targetTeam.players.filter((p) => p.id !== midfielder.id)
          player1Team.players.push(midfielder)
        }
      }
    }
  })
}

export function balanceTeams(players: Player[], mode: MatchFormatType): Team[] {
  const excludedPairs: string[][] = [['지원', '지원 2']]
  const teamSizes = mode.split(':').map(Number)
  const numTeams = teamSizes.length

  const positionMap: Record<string, Player[]> = {}
  players.forEach((player) => {
    if (!positionMap[player.position]) {
      positionMap[player.position] = []
    }
    positionMap[player.position].push(player)
  })

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))

  const assignPlayersToTeams = (position: string) => {
    if (!positionMap[position]?.length) return

    const players = shuffleArray([...positionMap[position]])

    for (let i = 0; i < numTeams && players.length > 0; i++) {
      teams[i].players.push(players.shift()!)
    }

    while (players.length > 0) {
      const targetTeam = teams.reduce(
        (minTeam, currentTeam) => (currentTeam.players.length < minTeam.players.length ? currentTeam : minTeam),
        teams[0]
      )
      targetTeam.players.push(players.shift()!)
    }
  }

  assignPlayersToTeams(PLAYER_POSITIONS.DEFENDER)
  assignPlayersToTeams(PLAYER_POSITIONS.FORWARD)
  assignPlayersToTeams(PLAYER_POSITIONS.MIDFIELDER)

  ensurePlayerSeparation(teams, excludedPairs)
  teams.forEach(setPlayerCondition)
  teams.forEach((team) => team.players.sort((a, b) => a.year.localeCompare(b.year)))

  return teams
}
