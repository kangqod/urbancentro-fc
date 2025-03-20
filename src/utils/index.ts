import type { KakaoWindow, Player, Team, MatchFormatType, ShareKakaoContent } from '@/types'
import { PLAYER_POSITIONS } from '@/constants'

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

  // 남은 선수들 배분 (미드필더 및 기타 포지션)
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

  // 최종 인원 체크 및 재조정
  const maxTeamSize = Math.ceil(players.length / numTeams)
  let hasAdjustment = true
  let safetyCounter = 0
  const MAX_ITERATIONS = 2

  while (hasAdjustment && safetyCounter < MAX_ITERATIONS) {
    hasAdjustment = false
    safetyCounter++

    // 가장 많은 인원을 가진 팀에서 가장 적은 인원을 가진 팀으로 이동
    const maxTeam = teams.reduce((max, team) => (team.players.length > max.players.length ? team : max), teams[0])
    const minTeam = teams.reduce((min, team) => (team.players.length < min.players.length ? team : min), teams[0])

    if (maxTeam.players.length > maxTeamSize && maxTeam.players.length - minTeam.players.length > 1) {
      // 이동할 선수 선택 (공격수와 수비수는 마지막 한 명은 이동하지 않음)
      const movablePlayers = maxTeam.players.filter((p) => {
        if (p.position === PLAYER_POSITIONS.FORWARD) {
          return maxTeam.players.filter((player) => player.position === PLAYER_POSITIONS.FORWARD).length > 1
        }
        if (p.position === PLAYER_POSITIONS.DEFENDER) {
          return maxTeam.players.filter((player) => player.position === PLAYER_POSITIONS.DEFENDER).length > 1
        }
        return true
      })

      if (movablePlayers.length > 0) {
        const playerToMove = movablePlayers[movablePlayers.length - 1]
        maxTeam.players = maxTeam.players.filter((p) => p !== playerToMove)
        minTeam.players.push(playerToMove)
        hasAdjustment = true
      }
    }
  }

  if (safetyCounter >= MAX_ITERATIONS) {
    throw new Error('팀 밸런싱 중 오류가 발생했습니다')
  }

  // 각 팀별로 선수들을 year 순으로 정렬
  teams.forEach((team) => {
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
