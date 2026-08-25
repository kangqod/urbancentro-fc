import { describe, it, expect } from 'vitest'
import { parseCsv } from '../csv'

describe('parseCsv', () => {
  it('쉼표·줄바꿈으로 행과 필드를 나눈다', () => {
    expect(parseCsv('a,b,c\n1,2,3\n')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3']
    ])
  })

  it('CRLF와 선행 BOM을 처리한다', () => {
    expect(parseCsv('\uFEFFa,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2']
    ])
  })

  it('따옴표 안의 쉼표·줄바꿈·이스케이프된 따옴표를 보존한다', () => {
    expect(parseCsv('"x, y","line1\nline2","say ""hi"""')).toEqual([['x, y', 'line1\nline2', 'say "hi"']])
  })

  it('빈 필드와 마지막 줄바꿈 없는 입력을 처리한다', () => {
    expect(parseCsv('a,,c\n,,')).toEqual([
      ['a', '', 'c'],
      ['', '', '']
    ])
  })
})
