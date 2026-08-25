import { describe, it, expect, vi, afterEach } from 'vitest'
import { parseRosterCsv } from '../roster-csv'

const HEADER = '"이름","출생년도","등번호","티어","강점","특성"'

describe('parseRosterCsv', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('시트 게시 CSV 형식을 RosterRow로 변환한다', () => {
    const rows = parseRosterCsv(
      `${HEADER}\n"김성일","1986","11","상급","골 결정력","유스 출신/검단 메시"\n"오정오","1989","0","초급","",""\n`
    )
    expect(rows).toEqual([
      {
        name: '김성일',
        year: '1986',
        number: 11,
        tier: '상급',
        strength: '골 결정력',
        attributes: ['유스 출신', '검단 메시'],
        isPremium: false
      },
      { name: '오정오', year: '1989', number: 0, tier: '초급', strength: '', attributes: [], isPremium: false }
    ])
  })

  it('헤더 순서가 바뀌어도 이름으로 매핑한다', () => {
    const rows = parseRosterCsv('티어,이름,특성,등번호,강점,출생년도\n상급,홍길동,a / b,7,패스,1990')
    expect(rows[0]).toEqual({
      name: '홍길동',
      year: '1990',
      number: 7,
      tier: '상급',
      strength: '패스',
      attributes: ['a', 'b'],
      isPremium: false
    })
  })

  it('프리미엄 열은 체크박스(TRUE/FALSE)·O/Y/1 을 인식하고, 열이 없으면 전원 false', () => {
    const rows = parseRosterCsv(
      `${HEADER},"프리미엄"\n갑,1990,1,상급,,,TRUE\n을,1990,2,상급,,,FALSE\n병,1990,3,상급,,,O\n정,1990,4,상급,,,\n무,1990,5,상급,,,아니오`
    )
    expect(rows.map((r) => r.isPremium)).toEqual([true, false, true, false, false])
    expect(parseRosterCsv(`${HEADER}\n갑,1990,1,상급,,`)[0].isPremium).toBe(false)
  })

  it('2자리 연도는 세기를 붙이고, 빈 등번호는 0, 이름 없는 행은 스킵한다', () => {
    const rows = parseRosterCsv(`${HEADER}\n홍길동,89,,중급,,\n,,,,,\n김영희,05,x,초급,,`)
    expect(rows.map((r) => [r.name, r.year, r.number])).toEqual([
      ['홍길동', '1989', 0],
      ['김영희', '2005', 0]
    ])
  })

  it('알 수 없는 티어는 중급으로 폴백하고 경고한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const rows = parseRosterCsv(`${HEADER}\n홍길동,1990,1,고급,,`)
    expect(rows[0].tier).toBe('중급')
    expect(warn).toHaveBeenCalledOnce()
  })

  it('연도 형식이 틀린 행은 경고 후 버린다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const rows = parseRosterCsv(`${HEADER}\n홍길동,199,1,중급,,\n김영희,1990,2,중급,,`)
    expect(rows.map((r) => r.name)).toEqual(['김영희'])
    expect(warn).toHaveBeenCalledOnce()
  })

  it('헤더 누락·빈 입력·유효 행 0개는 throw 한다', () => {
    expect(() => parseRosterCsv('')).toThrow()
    expect(() => parseRosterCsv('이름,출생년도\n홍길동,1990')).toThrow(/missing header/)
    expect(() => parseRosterCsv(`${HEADER}\n,,,,,`)).toThrow(/no valid rows/)
  })
})
