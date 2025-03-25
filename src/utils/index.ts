import type { KakaoWindow, Player, Team, MatchFormatType, ShareKakaoContent } from '@/types'
import { PLAYER_CONDITIONS, PLAYER_POSITIONS } from '@/constants'

function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}

export function balanceTeams(players: Player[], mode: MatchFormatType): Team[] {
  const teamSizes = mode.split(':').map(Number)
  const numTeams = teamSizes.length

  // 포지션별로 그룹화
  const positionMap: Record<string, Player[]> = {}
  players.forEach((player) => {
    if (!positionMap[player.position]) {
      positionMap[player.position] = []
    }
    positionMap[player.position].push(player)
  })

  // 각 팀 초기화
  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    id: String(i + 1),
    name: `팀 ${String.fromCharCode(65 + i)}`,
    players: []
  }))

  // 각 팀에 수비수와 공격수 배정
  const assignPlayersToTeams = (position: string) => {
    if (!positionMap[position] || positionMap[position].length === 0) return

    shuffleArray(positionMap[position])
    const players = [...positionMap[position]]

    // 각 팀에 최소 1명씩 배정
    for (let i = 0; i < numTeams && players.length > 0; i++) {
      const player = players.shift()!
      teams[i].players.push(player)
    }

    // 남은 선수들은 인원이 적은 팀에 배정
    while (players.length > 0) {
      const player = players.shift()!
      const targetTeam = teams.reduce(
        (minTeam, currentTeam) => (currentTeam.players.length < minTeam.players.length ? currentTeam : minTeam),
        teams[0]
      )
      targetTeam.players.push(player)
    }

    // 배정된 선수들 제거
    positionMap[position] = []
  }

  // 수비수와 공격수 우선 배정
  assignPlayersToTeams(PLAYER_POSITIONS.DEFENDER)
  assignPlayersToTeams(PLAYER_POSITIONS.FORWARD)

  // 남은 선수들 배분 (미드필더)
  Object.entries(positionMap).forEach(([_, positionPlayers]) => {
    if (positionPlayers.length > 0) {
      shuffleArray(positionPlayers)
      positionPlayers.forEach((player) => {
        // 가장 적은 인원을 가진 팀에 배정
        const targetTeam = teams.reduce(
          (minTeam, currentTeam) => (currentTeam.players.length < minTeam.players.length ? currentTeam : minTeam),
          teams[0]
        )
        targetTeam.players.push(player)
      })
    }
  })

  teams.forEach((team) => {
    setPlayerCondition(team)

    // 각 팀별로 선수들을 year 순으로 정렬
    team.players.sort((a, b) => a.year.localeCompare(b.year))
  })

  return teams
}

export const shareKakao = (content: ShareKakaoContent) => {
  const kakao = (window as unknown as KakaoWindow).Kakao
  const baseUrl = window.location.origin + window.location.pathname
  const teamsParam = content.teams ? `?teams=${JSON.stringify(content.teams)}` : ''
  const shareUrl = baseUrl + teamsParam

  kakao.Share.sendDefault({
    objectType: 'text',
    text: content.description,
    link: {
      webUrl: shareUrl,
      mobileWebUrl: shareUrl
    }
  })
}

function setPlayerCondition(team: Team) {
  // 모든 선수의 컨디션을 기본값으로 초기화
  team.players.forEach((player) => {
    player.condition = PLAYER_CONDITIONS.MID
  })

  const lastIndex = team.players.length - 1
  // 처음과 마지막 선수의 컨디션은 항상 HIGH
  // 두 번째 선수부터 70%, 50%, 2% 순으로 감소
  for (let i = 0; i <= lastIndex; i++) {
    if (i === 0 || i === lastIndex) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
      continue
    }
    const probability = i === 1 ? 0.7 : i === 2 ? 0.5 : 0.02
    if (Math.random() < probability) {
      team.players[i].condition = PLAYER_CONDITIONS.HIGH
      console.log(i)
    }
  }
}
