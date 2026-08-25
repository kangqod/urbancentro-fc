import { composeRoster } from '../model/roster-store'
import type { RosterRow, RosterStatus } from '../model/types'
import { ROSTER_CSV_URL, ROSTER_FETCH_TIMEOUT_MS } from './constants'
import { readRosterCache, writeRosterCache } from './roster-cache'
import { parseRosterCsv } from './roster-csv'

export interface LoadRosterResult {
  rows: RosterRow[]
  status: Exclude<RosterStatus, 'loading'>
  // status === 'cached'일 때 캐시 저장 시각(ISO)
  savedAt?: string
}

export type FetchRosterText = (url: string, signal: AbortSignal) => Promise<string>

interface LoadRosterOptions {
  url?: string
  fetchText?: FetchRosterText
  timeoutMs?: number
}

async function defaultFetchText(url: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(url, { cache: 'no-store', signal })
  if (!res.ok) throw new Error(`roster fetch failed: ${res.status}`)
  return res.text()
}

// 원격 실패 시 마지막 성공분(localStorage)으로 복원하고, 그것도 없으면 error — 명단 없이는 서비스할 수 없다.
function recover(): LoadRosterResult {
  const cache = readRosterCache()
  if (cache) return { rows: composeRoster(cache.rows), status: 'cached', savedAt: cache.savedAt }
  return { rows: composeRoster([]), status: 'error' }
}

async function run({ url = ROSTER_CSV_URL, fetchText = defaultFetchText, timeoutMs = ROSTER_FETCH_TIMEOUT_MS }: LoadRosterOptions) {
  if (!url) {
    console.warn('[roster] ROSTER_CSV_URL 미설정')
    return recover()
  }

  const controller = new AbortController()
  // fetchText가 signal을 무시해도 타임아웃이 걸리도록 race로 감싼다.
  const timeout = new Promise<never>((_, reject) => {
    controller.signal.addEventListener('abort', () => reject(new Error('roster fetch timeout')), { once: true })
  })
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const text = await Promise.race([fetchText(url, controller.signal), timeout])
    const rows = parseRosterCsv(text)
    writeRosterCache(rows)
    return { rows: composeRoster(rows), status: 'remote' } satisfies LoadRosterResult
  } catch (error) {
    console.warn('[roster] 원격 명단 로딩 실패', error)
    return recover()
  } finally {
    clearTimeout(timer)
  }
}

// 모듈 전역 메모이즈 — StrictMode 이중 effect·재마운트에도 fetch는 1회. 재시도·테스트는 resetRosterLoader로 초기화.
let pending: Promise<LoadRosterResult> | null = null

export function loadRoster(options: LoadRosterOptions = {}): Promise<LoadRosterResult> {
  if (!pending) pending = run(options)
  return pending
}

export function resetRosterLoader(): void {
  pending = null
}
