import { describe, it, expect, beforeAll } from 'vitest'
import { composeRoster, useRosterStore } from '@/entities/player/model/roster-store'
import type { RosterRow } from '@/entities/player/model/types'
import { extractMatchedPlayersUnified } from '../extract-player'

const ROSTER: RosterRow[] = [
  { year: '1990', number: 1, name: '박치환', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: '1989', number: 2, name: '이원식', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: '1992', number: 3, name: '홍길동', tier: '중급', strength: '', attributes: [], isPremium: false }
]

describe('extractMatchedPlayersUnified', () => {
  beforeAll(() => {
    useRosterStore.setState({ rows: composeRoster(ROSTER), status: 'remote' })
  })

  it('오인식·약칭은 로스터 이름으로 매핑되고 불참 이후는 무시한다', () => {
    const names = extractMatchedPlayersUnified('90/박지환 원식 홍길동 불참 김철수').map((p) => p.name)
    expect(names).toEqual(['박치환', '이원식', '홍길동'])
  })

  it('시트에서 연도가 바뀌어도 별칭 매칭이 유지된다', () => {
    useRosterStore.setState({ rows: composeRoster([{ ...ROSTER[0], year: '1991' }]), status: 'remote' })
    expect(extractMatchedPlayersUnified('박지환')).toEqual([{ ...ROSTER[0], year: '1991' }])
  })
})
