import { describe, expect, it } from 'vitest'
import { PlayerClass } from '@/entities/player/model/player'
import type { Team } from '@/entities/team/model/types'
import { swapPlayers } from '../swap-players'

function makeTeams(): Team[] {
  return [
    { name: '팀 A', players: ['a1', 'a2', 'a3'].map((id) => new PlayerClass({ id, name: id })) },
    { name: '팀 B', players: ['b1', 'b2', 'b3'].map((id) => new PlayerClass({ id, name: id })) },
    { name: '팀 C', players: ['c1', 'c2', 'c3'].map((id) => new PlayerClass({ id, name: id })) }
  ]
}

const ids = (teams: Team[]) => teams.map((team) => team.players.map((player) => player.id))

describe('swapPlayers', () => {
  it('서로 다른 팀의 두 선수를 각자의 자리(인덱스)를 유지한 채 맞교환한다', () => {
    const result = swapPlayers(makeTeams(), 'a2', 'b3')

    expect(ids(result)).toEqual([
      ['a1', 'b3', 'a3'],
      ['b1', 'b2', 'a2'],
      ['c1', 'c2', 'c3']
    ])
  })

  it('인자 순서와 무관하게 같은 결과를 낸다', () => {
    const teams = makeTeams()
    expect(ids(swapPlayers(teams, 'c1', 'a3'))).toEqual(ids(swapPlayers(teams, 'a3', 'c1')))
  })

  it('같은 팀 두 선수면 입력 참조를 그대로 반환한다', () => {
    const teams = makeTeams()
    expect(swapPlayers(teams, 'a1', 'a3')).toBe(teams)
  })

  it('존재하지 않는 id면 입력 참조를 그대로 반환한다', () => {
    const teams = makeTeams()
    expect(swapPlayers(teams, 'a1', 'zz')).toBe(teams)
    expect(swapPlayers(teams, 'zz', 'b1')).toBe(teams)
  })

  it('동일 id면 입력 참조를 그대로 반환한다', () => {
    const teams = makeTeams()
    expect(swapPlayers(teams, 'b2', 'b2')).toBe(teams)
  })

  it('각 팀 인원수와 팀 이름이 변하지 않는다', () => {
    const teams = makeTeams()
    const result = swapPlayers(teams, 'a1', 'c2')

    expect(result.map((team) => team.players.length)).toEqual(teams.map((team) => team.players.length))
    expect(result.map((team) => team.name)).toEqual(teams.map((team) => team.name))
  })

  it('입력 배열과 팀 객체를 변경하지 않고, 관계없는 팀은 참조를 재사용한다', () => {
    const teams = makeTeams()
    const before = ids(teams)
    const result = swapPlayers(teams, 'a1', 'b1')

    expect(ids(teams)).toEqual(before)
    expect(result).not.toBe(teams)
    expect(result[0]).not.toBe(teams[0])
    expect(result[1]).not.toBe(teams[1])
    expect(result[2]).toBe(teams[2])
  })
})
