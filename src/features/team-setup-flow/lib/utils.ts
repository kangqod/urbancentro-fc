import { DEFAULT_ATTRIBUTES, DEFAULT_CONDITION, DEFAULT_STRENGTH, DEFAULT_YEAR, PLAYER_CONDITIONS, PLAYER_TIERS, PlayerClass, TIER_LABELS, toTierType } from '@/entities'
import type { ConditionType, Team, TierType } from '@/entities'
import playerData from '@/shared/assets/data.json'

// 레거시 링크 하위 호환: 한글 티어 마이그레이션 이전에 공유된 링크는 영문 티어('ace' 등)를
// 담고 있다. 공유 링크 복원 경로에서만 한글 티어로 매핑하고, toTierType 자체는 순수하게 둔다.
const LEGACY_TIER_ALIASES: Record<string, TierType> = {
  ace: PLAYER_TIERS.ACE,
  advanced: PLAYER_TIERS.ADVANCED,
  intermediate: PLAYER_TIERS.INTERMEDIATE,
  beginner: PLAYER_TIERS.BEGINNER
}

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
 * 배열 포맷은 이름에 `-`가 포함되어도 안전하다.
 * hasExplicitGuest는 isGuest가 직렬화 값에 실제로 담겼는지를 나타낸다.
 * 신규 배열 포맷(5-tuple)만 isGuest를 명시하며, isGuest가 없는 구 배열(4-tuple)이나
 * 레거시 문자열 포맷은 hasExplicitGuest=false로 표시해 복원 시 휴리스틱을 적용하게 한다.
 */
export function normalizeSharedPlayer(player: SharedPlayer | string): {
  year: string
  name: string
  condition: string
  tier: string
  isGuest: boolean
  hasExplicitGuest: boolean
} {
  if (Array.isArray(player)) {
    const [year = '', name = '', condition = '', tier = '', isGuest = false] = player
    return { year, name, condition, tier, isGuest, hasExplicitGuest: player.length >= 5 }
  }
  const [year = '', name = '', condition = '', tier = ''] = player.split('-')
  return { year, name, condition, tier, isGuest: false, hasExplicitGuest: false }
}

/**
 * 공유 링크의 단일 플레이어 항목으로 PlayerClass를 만든다.
 * 로스터(data.json)에서 이름+연도가 일치하면 로스터 정보로 복원한다.
 * 매칭에 실패했을 때의 게스트 여부는 직렬화 포맷에 따라 다르게 결정한다:
 *  - 신규 포맷(isGuest 명시): 직렬화된 값을 신뢰한다. isGuest=false인 실제 멤버가
 *    data.json에서 이름 변경/삭제되어 매칭에 실패해도 게스트로 오분류하지 않는다.
 *  - 레거시 포맷(isGuest 미포함): 정규/지원 선수는 모두 data.json에 있으므로 매칭 실패는
 *    게스트로 간주한다. 게스트가 "00 이름"이 아니라 "G 이름"으로 올바르게 표시된다.
 * parseSharedTeams와 createPlayersFromTeams가 공통으로 사용한다.
 */
export function buildSharedPlayer(rawPlayer: SharedPlayer | string, id: string): PlayerClass {
  const { year, name, condition, tier, isGuest, hasExplicitGuest } = normalizeSharedPlayer(rawPlayer)
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

  // 신규 포맷은 직렬화된 isGuest를 신뢰하고, 레거시 포맷은 매칭 실패 → 게스트 휴리스틱을 적용한다.
  const resolvedIsGuest = hasExplicitGuest ? isGuest : true

  return new PlayerClass({
    id,
    name,
    // 게스트는 연도가 의미 없으므로 DEFAULT_YEAR 센티넬로 복원해 속성 모달(title.tsx)에서 연도를 숨긴다.
    // 비게스트(로스터에서 사라진 실제 멤버)는 직렬화된 2자리 연도를 그대로 보존한다.
    year: resolvedIsGuest ? DEFAULT_YEAR : year,
    // 레거시 링크의 영문 티어를 한글로 매핑한 뒤 검증한다(마이그레이션 이전 링크가 중급으로 강등되지 않도록).
    tier: toTierType(LEGACY_TIER_ALIASES[tier] ?? tier),
    strength: DEFAULT_STRENGTH,
    attributes: DEFAULT_ATTRIBUTES,
    condition: (condition || DEFAULT_CONDITION) as ConditionType,
    isGuest: resolvedIsGuest,
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
