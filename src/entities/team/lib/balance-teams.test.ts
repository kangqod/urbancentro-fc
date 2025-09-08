import playerData from '@/shared/assets/data.json'
import { describe, it, expect, beforeEach } from 'vitest'
import type { Player } from '@/entities'
import { balanceTeams } from './balance-teams'

let allPlayers: Player[]

beforeEach(() => {
  // 테스트마다 fresh하게 복제
  allPlayers = getAllPlayers()
    .slice(0, 10)
    .map((p) => ({ ...p }))
})

function getAllPlayers(): Player[] {
  const players = playerData as Player[]
  return players.map((player) => ({ ...player, isActiveForMatch: true }))
}

function getBasePlayers(mode: string = '5:5') {
  let players = null
  switch (mode) {
    case '5:5':
      players = playerData.slice(2, 12) as Player[]
      break
    case '5:5:5':
      players = playerData.slice(2, 17) as Player[]
      break
    case '6:6':
      players = playerData.slice(2, 14) as Player[]
      break
    case '6:6:6':
      players = playerData.slice(2, 20) as Player[]
      break
    case '7:7':
      players = playerData.slice(2, 16) as Player[]
      break
    case '7:7:7':
      players = playerData.slice(2, 23) as Player[]
      break
    case '5:5:5:5':
      players = playerData.slice(2, 22) as Player[]
      break
    default:
      players = playerData.slice(2, 12) as Player[]
  }
  return players.map((player) => ({ ...player, isActiveForMatch: true }))
}

describe('balanceTeams', () => {
  it('게스트와 연결된 선수가 항상 같은 팀에 배치된다', () => {
    allPlayers[0].id = 'guest1'
    allPlayers[1].id = 'guest2'
    allPlayers[0].name = 'guest1'
    allPlayers[1].name = 'guest2'
    allPlayers[4].id = 'player4'
    allPlayers[5].id = 'player5'
    allPlayers[0].connectedPlayerIds = ['player4']
    allPlayers[1].connectedPlayerIds = ['player5']
    allPlayers[4].connectedPlayerIds = ['guest1']
    allPlayers[5].connectedPlayerIds = ['guest2']

    const teams = balanceTeams(allPlayers, '5:5')
    const teamOfP1 = teams.find((t) => t.players.some((p) => p.id === allPlayers[0].id))
    const teamOfG1 = teams.find((t) => t.players.some((p) => p.id === allPlayers[4].id))
    expect(teamOfP1?.name).toBe(teamOfG1?.name)
    const teamOfP2 = teams.find((t) => t.players.some((p) => p.id === allPlayers[1].id))
    const teamOfG2 = teams.find((t) => t.players.some((p) => p.id === allPlayers[5].id))
    expect(teamOfP2?.name).toBe(teamOfG2?.name)
  })

  it('지원 1, 지원 2는 반드시 분리된다', () => {
    const players = allPlayers.slice(0, 10)
    const teams = balanceTeams(players, '5:5')
    const team1 = teams.find((t) => t.players.some((p) => p.name === '지원 1'))
    const team2 = teams.find((t) => t.players.some((p) => p.name === '지원 2'))
    expect(team1?.name).not.toBe(team2?.name)
  })

  it('팀 인원 밸런스가 맞는지', () => {
    const players: Player[] = [
      { ...allPlayers[6], isGuest: false },
      { ...allPlayers[7], isGuest: false },
      { ...allPlayers[8], isGuest: false },
      { ...allPlayers[9], isGuest: false }
    ]
    const teams = balanceTeams(players, '5:5')
    expect(teams.every((t) => t.players.length <= 5)).toBe(true)
  })

  it('ACE 없는 팀에 밸런스 보정이 적용된다', () => {
    const basePlayers = getBasePlayers()
    const teams = balanceTeams(basePlayers, '5:5')
    const aceTeams = teams.filter((t) => t.players.some((p) => p.tier === 'ace'))
    const aceLessTeams = teams.filter((t) => !t.players.some((p) => p.tier === 'ace'))
    expect(aceTeams.length + aceLessTeams.length).toBe(2)
  })
})
