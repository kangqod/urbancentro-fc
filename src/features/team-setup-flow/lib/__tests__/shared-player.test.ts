import { describe, it, expect } from 'vitest'
import { PLAYER_CONDITIONS, PLAYER_TIERS, PlayerClass, DEFAULT_YEAR, DEFAULT_NUMBER, DEFAULT_TIER } from '@/entities'
import type { Player, Team } from '@/entities'
import playerData from '@/shared/assets/data.json'
import { parseSharedTeams, type SharedPlayer, type SharedTeam } from '../utils'

// footer.hooks.handleShareKakao 의 직렬화 로직을 그대로 재현한다.
function serialize(teams: Team[]): string {
  const teamsData = teams.map((team): SharedTeam => [
    team.name.slice(-1),
    team.players.map((player): SharedPlayer => [
      player.year ? player.year.slice(-2) : '99',
      player.name,
      player.condition === PLAYER_CONDITIONS.HIGH ? PLAYER_CONDITIONS.HIGH : '',
      player.tier,
      player.isGuest
    ])
  ])
  return JSON.stringify(teamsData)
}

function roundTrip(players: Player[]): Player[] {
  const teams: Team[] = [{ name: '팀 A', players }]
  return parseSharedTeams(serialize(teams))![0].players
}

describe('공유 링크 선수 복원 (buildSharedPlayer / parseSharedTeams)', () => {
  it('일반 로스터 선수는 연도가 유지되고 게스트가 아니다', () => {
    const roster = playerData.find((p) => p.name !== '지원 1' && p.name !== '지원 2' && p.year !== DEFAULT_YEAR)!
    const player = new PlayerClass({ ...roster, tier: roster.tier as never, isActiveForMatch: true })

    const [restored] = roundTrip([player])

    expect(restored.isGuest).toBe(false)
    expect(restored.year).toBe(roster.year)
  })

  it('지원 선수(지원 1/2)는 게스트가 아니라 지원으로 복원된다', () => {
    const support = playerData.find((p) => p.name === '지원 1')!
    const player = new PlayerClass({ ...support, tier: support.tier as never, isActiveForMatch: true })

    const [restored] = roundTrip([player])

    // 로스터에 존재하므로 게스트로 오분류되면 안 된다 (S 배지 유지).
    expect(restored.isGuest).toBe(false)
    expect(restored.name).toBe('지원 1')
  })

  it('게스트는 게스트 플래그가 유지되어 연도(00)가 아닌 G로 표시된다', () => {
    const guest = new PlayerClass({
      id: 'guest-1',
      name: '홍길동',
      year: DEFAULT_YEAR,
      number: DEFAULT_NUMBER,
      tier: DEFAULT_TIER,
      isGuest: true,
      isActiveForMatch: true
    })

    const [restored] = roundTrip([guest])

    expect(restored.isGuest).toBe(true)
    // 속성 모달(title.tsx)이 DEFAULT_YEAR 를 숨기므로, 게스트는 연도 없이 표시된다.
    expect(restored.year).toBe(DEFAULT_YEAR)
  })

  it('레거시 문자열 포맷 링크에서도 로스터에 없는 선수는 게스트로 복원된다', () => {
    // 구 포맷: "year-name-condition" (isGuest 없음)
    const legacy: SharedTeam[] = [['A', ['00-홍길동-']]]
    const restored = parseSharedTeams(JSON.stringify(legacy))![0].players[0]

    // 회귀 방지: 예전에는 isGuest=false 로 복원되어 "00 홍길동" 으로 표시됐다.
    expect(restored.isGuest).toBe(true)
    expect(restored.year).toBe(DEFAULT_YEAR)
  })

  it('신규 포맷에서 isGuest=false 인 실제 멤버는 로스터 매칭에 실패해도 게스트로 오분류되지 않고 연도를 보존한다', () => {
    // data.json 에 없는 이름 + isGuest=false (예: 링크 공유 후 로스터에서 이름 변경/삭제된 정규 멤버).
    const shared: SharedTeam[] = [['A', [['89', '없는정규멤버', '', PLAYER_TIERS.ADVANCED, false]]]]
    const restored = parseSharedTeams(JSON.stringify(shared))![0].players[0]

    // 회귀 방지: 매칭 실패를 무조건 게스트로 강제하면 실제 팀원이 "G" 배지로 잘못 표시된다.
    expect(restored.isGuest).toBe(false)
    expect(restored.year).toBe('89')
    expect(restored.tier).toBe(PLAYER_TIERS.ADVANCED)
  })

  it('마이그레이션 이전(영문 티어) 레거시 링크의 게스트 티어가 중급으로 강등되지 않고 매핑된다', () => {
    // 구 링크는 영문 티어('ace')를 담고 있다. 검증 실패로 DEFAULT_TIER(중급)로 떨어지면 안 된다.
    const legacy: SharedTeam[] = [['A', [['00', '에이스게스트', '', 'ace', true]]]]
    const restored = parseSharedTeams(JSON.stringify(legacy))![0].players[0]

    expect(restored.isGuest).toBe(true)
    expect(restored.tier).toBe(PLAYER_TIERS.ACE)
  })

  it.each([PLAYER_TIERS.ACE, PLAYER_TIERS.ADVANCED, PLAYER_TIERS.INTERMEDIATE, PLAYER_TIERS.BEGINNER])(
    '게스트의 tier=%s 는 신규 포맷 직렬화→역직렬화 왕복 후에도 게스트 플래그와 함께 보존된다',
    (tier) => {
      const guest = new PlayerClass({
        id: `guest-${tier}`,
        name: '왕복게스트',
        year: DEFAULT_YEAR,
        number: DEFAULT_NUMBER,
        tier,
        isGuest: true,
        isActiveForMatch: true
      })

      const [restored] = roundTrip([guest])

      expect(restored.isGuest).toBe(true)
      expect(restored.tier).toBe(tier)
    }
  )

  it.each([PLAYER_TIERS.ACE, PLAYER_TIERS.ADVANCED, PLAYER_TIERS.INTERMEDIATE, PLAYER_TIERS.BEGINNER])(
    '로스터 매칭에 실패한 비게스트(tier=%s)도 게스트로 오분류되지 않고 직렬화된 tier를 보존한다',
    (tier) => {
      // 로스터에 없는 이름 + isGuest=false: buildSharedPlayer가 playerInfo를 못 찾으므로
      // (로스터 매칭 시엔 playerInfo.tier가 우선하는 것과 달리) 직렬화된 tier가 그대로 쓰인다.
      const shared: SharedTeam[] = [['A', [['89', '없는정규멤버', '', tier, false]]]]
      const restored = parseSharedTeams(JSON.stringify(shared))![0].players[0]

      expect(restored.isGuest).toBe(false)
      expect(restored.tier).toBe(tier)
    }
  )
})
