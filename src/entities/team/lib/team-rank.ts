import { PLAYER_TIERS, PLAYER_CONDITIONS } from '@/entities/player/model/player'
import type { Team } from '@/entities/team/model/types'
import { calculateTeamStrength } from './balance-score'
import { PREMIUM_PLAYERS } from './constants'

// 탑독/언더독 판정 (밸런스 정보 모달 + 팀 헤더 공용 단일 소스).
// powerScore 는 밸런서가 쓰지 않는 표시 전용 화력 지표다 — 밸런싱 로직과 무관.
export function getTopDogTeamNames(teams: Team[]): Set<string> {
  const ranked = teams
    .map((team) => {
      const strength = calculateTeamStrength(team)
      const highCount = team.players.filter((p) => p.condition === PLAYER_CONDITIONS.HIGH).length
      const premiumCount = team.players.filter((p) => PREMIUM_PLAYERS.some((pp) => pp.name === p.name && pp.year === p.year)).length

      // 최강/약체 판정용 종합 화력: 점수 + HIGH 컨디션 + 프리미엄 선수 수를 가중 합산.
      const powerScore = strength + highCount * 2 + premiumCount * 3

      const aceCount = team.players.filter((p) => p.tier === PLAYER_TIERS.ACE).length
      const advancedCount = team.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length
      const intermediateCount = team.players.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE).length

      return { name: team.name, strength, highCount, premiumCount, powerScore, aceCount, advancedCount, intermediateCount }
    })
    // 종합 화력 내림차순. 타이브레이크: powerScore → 팀점수 → 프리미엄 → HIGH → 상위 티어 구성
    // (에이스→상급→중급) → 팀 이름. 마지막 이름 비교로 완전 동점을 없애 항상 강/약이 갈리게 한다.
    .sort(
      (a, b) =>
        b.powerScore - a.powerScore ||
        b.strength - a.strength ||
        b.premiumCount - a.premiumCount ||
        b.highCount - a.highCount ||
        b.aceCount - a.aceCount ||
        b.advancedCount - a.advancedCount ||
        b.intermediateCount - a.intermediateCount ||
        a.name.localeCompare(b.name)
    )

  const topDogCount = Math.max(1, Math.floor(teams.length / 2))
  return new Set(ranked.slice(0, topDogCount).map((t) => t.name))
}
