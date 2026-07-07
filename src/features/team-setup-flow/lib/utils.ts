import { DEFAULT_ATTRIBUTES, DEFAULT_CONDITION, DEFAULT_STRENGTH, PLAYER_CONDITIONS, PlayerClass, TIER_LABELS, toTierType } from '@/entities'
import type { ConditionType, Team, TierType } from '@/entities'
import playerData from '@/shared/assets/data.json'

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
        .map((p) => `${p.year ? `${p.year.slice(-2)}` : '99'} ${p.name} [${TIER_LABELS[p.tier] ?? p.tier}] ${p.condition === PLAYER_CONDITIONS.HIGH ? '↑' : ''}`.trimEnd())
        .join('\n')
      return `${team.name}\n${playerList}`
    })
    .join('\n\n')
}

// 공유 링크의 플레이어 표현: [year, name, condition, tier, isGuest] 배열.
// tier와 isGuest를 항상 함께 직렬화하므로, 로스터에서 찾지 못한 선수도
// 원래 게스트 여부와 실력 등급을 잃지 않고 복원된다.
// 레거시 포맷('year-name-condition-tier' 문자열)도 하위 호환으로 파싱한다.
export type SharedPlayer = [string, string, string, string, boolean]

// 공유 링크의 팀 표현: [팀 이름, 플레이어 목록].
export type SharedTeam = [string, (SharedPlayer | string)[]]

/**
 * 공유된 플레이어 항목을 필드로 정규화한다.
 * 신규(배열) 포맷과 레거시(`-` 구분 문자열) 포맷을 모두 지원한다.
 * 배열 포맷은 이름에 `-`가 포함되어도 안전하며, isGuest가 없는 구 배열(4-tuple)은
 * isGuest=false로 안전하게 폴백한다.
 */
export function normalizeSharedPlayer(player: SharedPlayer | string): {
  year: string
  name: string
  condition: string
  tier: string
  isGuest: boolean
} {
  if (Array.isArray(player)) {
    const [year = '', name = '', condition = '', tier = '', isGuest = false] = player
    return { year, name, condition, tier, isGuest }
  }
  const [year = '', name = '', condition = '', tier = ''] = player.split('-')
  return { year, name, condition, tier, isGuest: false }
}

/**
 * 공유 링크의 단일 플레이어 항목으로 PlayerClass를 만든다.
 * 로스터(data.json)에서 이름+연도가 일치하면 로스터 정보로 복원하고,
 * 그렇지 않으면 직렬화된 값(등급/게스트 여부 포함)을 그대로 사용한다.
 * parseSharedTeams와 createPlayersFromTeams가 공통으로 사용한다.
 */
export function buildSharedPlayer(rawPlayer: SharedPlayer | string, id: string): PlayerClass {
  const { year, name, condition, tier, isGuest } = normalizeSharedPlayer(rawPlayer)
  const playerInfo = !isGuest ? playerData.find((player) => player.name === name && player.year.slice(-2) === year) : undefined

  if (playerInfo) {
    return new PlayerClass({
      id,
      name: playerInfo.name,
      number: playerInfo.number,
      year: playerInfo.year,
      tier: playerInfo.tier as TierType,
      strength: playerInfo.strength,
      attributes: playerInfo.attributes,
      condition: (condition || DEFAULT_CONDITION) as ConditionType,
      isGuest: false,
      isActiveForMatch: true
    })
  }

  return new PlayerClass({
    id,
    name,
    year,
    tier: toTierType(tier),
    strength: DEFAULT_STRENGTH,
    attributes: DEFAULT_ATTRIBUTES,
    condition: (condition || DEFAULT_CONDITION) as ConditionType,
    isGuest,
    isActiveForMatch: true
  })
}

export function parseSharedTeams(teamsParam: string | null): Team[] | null {
  if (!teamsParam) throw new Error('팀 데이터를 불러오는데 실패했습니다.')

  try {
    const decodedTeams = JSON.parse(teamsParam) as SharedTeam[]
    const formattedTeams: Team[] = decodedTeams.map((team, index) => ({
      id: String(index + 1),
      name: `팀 ${team[0]}`,
      players: team[1].map((rawPlayer, playerIndex) => buildSharedPlayer(rawPlayer, `shared-${index}-${playerIndex}`))
    }))
    return formattedTeams
  } catch (error) {
    throw new Error('팀 데이터를 불러오는데 실패했습니다.')
  }
}
