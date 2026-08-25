import { toTierType } from '../model/player'
import type { RosterRow } from '../model/types'

export const ROSTER_CACHE_KEY = 'roster-cache-v1'

export interface RosterCache {
  rows: RosterRow[]
  savedAt: string
}

type RawRosterRow = Omit<RosterRow, 'tier' | 'number' | 'isPremium'> & { tier: string; number?: unknown; isPremium?: unknown }

const isRawRosterRow = (value: unknown): value is RawRosterRow => {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return typeof row.name === 'string' && typeof row.year === 'string' && typeof row.tier === 'string' && Array.isArray(row.attributes)
}

// 구버전·손상 캐시도 CSV 파서(parseRosterCsv)와 같은 기본값으로 맞춘다 — 캐시는 유일한 폴백이라 버리지 않고 살린다.
const normalizeRow = (row: RawRosterRow): RosterRow => ({
  ...row,
  tier: toTierType(row.tier),
  number: Number.parseInt(String(row.number), 10) || 0,
  isPremium: row.isPremium === true
})

// localStorage는 사파리 프라이빗 모드 등에서 접근 자체가 throw 할 수 있어 읽기/쓰기 모두 try로 감싼다.
export function readRosterCache(): RosterCache | null {
  try {
    const raw = localStorage.getItem(ROSTER_CACHE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const { rows, savedAt } = parsed as Partial<RosterCache>
    if (!Array.isArray(rows) || rows.length === 0 || !rows.every(isRawRosterRow) || typeof savedAt !== 'string') return null
    return { rows: rows.map(normalizeRow), savedAt }
  } catch {
    return null
  }
}

// 원격 성공마다 무조건 덮어쓴다 — savedAt은 "마지막으로 최신 명단을 받은 시각". 저장 실패는 치명적이지 않다.
export function writeRosterCache(rows: RosterRow[], savedAt = new Date().toISOString()): void {
  try {
    localStorage.setItem(ROSTER_CACHE_KEY, JSON.stringify({ rows, savedAt } satisfies RosterCache))
  } catch {
    // 다음 로드에서 원격을 다시 시도하므로 무시
  }
}

export function clearRosterCache(): void {
  try {
    localStorage.removeItem(ROSTER_CACHE_KEY)
  } catch {
    return
  }
}
