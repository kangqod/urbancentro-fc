import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadRoster, resetRosterLoader } from '../load-roster'
import { ROSTER_CACHE_KEY, clearRosterCache, readRosterCache, writeRosterCache } from '../roster-cache'
import { SUPPORT_SLOTS } from '../../model/support-slots'
import type { RosterRow } from '../../model/types'

const CSV = '이름,출생년도,등번호,티어,강점,특성\n홍길동,1990,7,상급,패스,a/b\n'
const CACHED: RosterRow[] = [{ name: '캐시맨', year: '1988', number: 1, tier: '중급', strength: '', attributes: [], isPremium: false }]
const supportNames = SUPPORT_SLOTS.map((slot) => slot.name)
const names = (rows: RosterRow[]) => rows.map((row) => row.name)

describe('loadRoster', () => {
  beforeEach(() => {
    resetRosterLoader()
    clearRosterCache()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('CSV를 받으면 remote 로스터 앞에 지원 슬롯을 붙이고 캐시에 저장한다', async () => {
    const result = await loadRoster({ url: 'https://sheet', fetchText: async () => CSV })
    expect(result.status).toBe('remote')
    expect(names(result.rows)).toEqual([...supportNames, '홍길동'])
    expect(names(readRosterCache()!.rows)).toEqual(['홍길동'])
  })

  it('시트에 지원 1/2 행이 있어도 코드 상수만 남긴다', async () => {
    const csv = `${CSV}지원 1,1995,9,상급,,\n지원 2,1996,10,상급,,\n`
    const result = await loadRoster({ url: 'https://sheet', fetchText: async () => csv })
    expect(names(result.rows)).toEqual([...supportNames, '홍길동'])
    expect(result.rows.filter((row) => supportNames.includes(row.name))).toEqual(SUPPORT_SLOTS)
  })

  it('원격 성공마다 캐시와 savedAt을 덮어쓴다', async () => {
    writeRosterCache(CACHED, '2020-01-01T00:00:00.000Z')
    await loadRoster({ url: 'https://sheet', fetchText: async () => CSV })
    const updated = readRosterCache()!
    expect(names(updated.rows)).toEqual(['홍길동'])
    expect(updated.savedAt > '2020-01-01T00:00:00.000Z').toBe(true)
  })

  it('fetch 실패 시 캐시가 있으면 cached + savedAt, 없으면 error', async () => {
    const noCache = await loadRoster({ url: 'https://sheet', fetchText: async () => Promise.reject(new Error('boom')) })
    expect(noCache.status).toBe('error')
    expect(names(noCache.rows)).toEqual(supportNames)

    resetRosterLoader()
    writeRosterCache(CACHED, '2024-05-01T00:00:00.000Z')
    const fromCache = await loadRoster({ url: 'https://sheet', fetchText: async () => Promise.reject(new Error('boom')) })
    expect(fromCache.status).toBe('cached')
    expect(fromCache.savedAt).toBe('2024-05-01T00:00:00.000Z')
    expect(names(fromCache.rows)).toEqual([...supportNames, '캐시맨'])
  })

  it('파싱 실패(빈 시트)·타임아웃·URL 미설정도 같은 복구 경로를 탄다', async () => {
    const empty = await loadRoster({ url: 'https://sheet', fetchText: async () => '이름,출생년도,등번호,티어,강점,특성\n' })
    expect(empty.status).toBe('error')

    resetRosterLoader()
    const timeout = await loadRoster({ url: 'https://sheet', fetchText: () => new Promise<string>(() => {}), timeoutMs: 10 })
    expect(timeout.status).toBe('error')

    resetRosterLoader()
    const fetchText = vi.fn()
    const noUrl = await loadRoster({ url: '', fetchText })
    expect(fetchText).not.toHaveBeenCalled()
    expect(noUrl.status).toBe('error')
  })

  it('손상된 캐시는 무시한다', async () => {
    localStorage.setItem(ROSTER_CACHE_KEY, '{"rows":[{"name":1}],"savedAt":"x"}')
    expect(readRosterCache()).toBeNull()
    const result = await loadRoster({ url: 'https://sheet', fetchText: async () => Promise.reject(new Error('boom')) })
    expect(result.status).toBe('error')
  })

  it('구버전·손상 캐시 행은 CSV 파서와 같은 기본값으로 정규화한다', () => {
    localStorage.setItem(
      ROSTER_CACHE_KEY,
      JSON.stringify({ rows: [{ name: '옛캐시', year: '1990', tier: '고급', number: '7', attributes: [] }], savedAt: 'x' })
    )
    expect(readRosterCache()!.rows).toEqual([{ name: '옛캐시', year: '1990', tier: '중급', number: 7, attributes: [], isPremium: false }])
  })

  it('같은 로더는 한 번만 실행되고 결과를 공유한다', async () => {
    const fetchText = vi.fn(async () => CSV)
    const [a, b] = await Promise.all([loadRoster({ url: 'https://sheet', fetchText }), loadRoster({ url: 'https://sheet', fetchText })])
    expect(fetchText).toHaveBeenCalledOnce()
    expect(a).toBe(b)
  })
})
