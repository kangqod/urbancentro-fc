import { describe, it, expect, beforeEach } from 'vitest'
import { composeRoster, useRosterStore } from '@/entities/player/model/roster-store'
import type { RosterRow } from '@/entities/player/model/types'
import { extractOcrCandidates } from '../extract-player'

const ROSTER: RosterRow[] = [
  { year: '1990', number: 1, name: '박치환', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: '1989', number: 2, name: '이원식', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: '1992', number: 3, name: '홍길동', tier: '중급', strength: '', attributes: [], isPremium: false }
]

const seed = (rows: RosterRow[]) => useRosterStore.setState({ rows: composeRoster(rows), status: 'remote' })

describe('extractOcrCandidates', () => {
  beforeEach(() => {
    seed(ROSTER)
  })

  it('오인식·약칭은 로스터 이름으로 매핑되고 불참 이후는 무시한다', () => {
    const names = extractOcrCandidates('90/박지환 원식 홍길동 불참 김철수').matches.map((m) => m.player.name)
    expect(names).toEqual(['박치환', '이원식', '홍길동'])
  })

  it('시트에서 연도가 바뀌어도 별칭 매칭이 유지된다', () => {
    seed([{ ...ROSTER[0], year: '1991' }])
    expect(extractOcrCandidates('박지환').matches.map((m) => m.player)).toEqual([{ ...ROSTER[0], year: '1991' }])
  })

  it('매칭 경로별로 kind와 OCR 원문을 기록한다', () => {
    const { matches } = extractOcrCandidates('90/박지환 원식 홍길동 홍길순 89/이원식')
    expect(matches.map(({ player, kind, raw }) => ({ name: player.name, kind, raw }))).toEqual([
      { name: '박치환', kind: 'alias', raw: '박지환' },
      { name: '이원식', kind: 'exact', raw: '이원식' },
      { name: '홍길동', kind: 'exact', raw: '홍길동' }
    ])

    const prefixOnly = extractOcrCandidates('홍길순').matches
    expect(prefixOnly.map(({ player, kind, raw }) => ({ name: player.name, kind, raw }))).toEqual([
      { name: '홍길동', kind: 'prefix', raw: '홍길순' }
    ])
  })

  it('한 토큰이 프리픽스와 별칭 양쪽으로 매칭되면 두 번 기록된다', () => {
    seed([...ROSTER, { ...ROSTER[0], name: '박지성', number: 4 }])
    const { matches, unmatched } = extractOcrCandidates('박지환')
    expect(matches.map(({ player, kind, raw }) => ({ name: player.name, kind, raw }))).toEqual([
      { name: '박지성', kind: 'prefix', raw: '박지환' },
      { name: '박치환', kind: 'alias', raw: '박지환' }
    ])
    expect(unmatched).toEqual([])
  })

  it('미인식은 불참 이전·2~4자·로스터 미도달 토큰만 등장 순서대로 중복 없이 모은다', () => {
    const { unmatched } = extractOcrCandidates('김철수 홍길동 최영 김철수 가나다라마 원식 불참 이영희')
    expect(unmatched).toEqual(['김철수', '최영'])
  })

  it('앞 2글자가 로스터와 겹치는 토큰은 이미 쓰인 선수여도 미인식에서 빠진다', () => {
    const { matches, unmatched } = extractOcrCandidates('홍길동 홍길순')
    expect(matches.map((m) => m.player.name)).toEqual(['홍길동'])
    expect(unmatched).toEqual([])
  })

  it('카톡 투표 화면 문구는 미인식에서 뺀다', () => {
    const { unmatched } = extractOcrCandidates('투표 투표가 현황 항목별 멤버별 참석 김철수 불참')
    expect(unmatched).toEqual(['김철수'])
  })
})
