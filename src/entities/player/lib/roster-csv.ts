import { parseCsv } from '@/shared/lib/csv'
import { toTierType } from '../model/player'
import type { RosterRow } from '../model/types'

const HEADERS = {
  name: '이름',
  year: '출생년도',
  number: '등번호',
  tier: '티어',
  strength: '강점',
  attributes: '특성',
  premium: '프리미엄'
} as const

type HeaderKey = keyof typeof HEADERS
// 없어도 되는 열 — 헤더가 없으면 전원 false. 시트에 열을 나중에 추가해도 기존 시트가 깨지지 않게.
const OPTIONAL_HEADERS: ReadonlySet<HeaderKey> = new Set(['premium'])

// 체크박스 CSV(TRUE/FALSE) 외에 손으로 O/Y/1 을 쳐도 인식
const TRUTHY = new Set(['true', 'o', 'y', 'yes', '1', '예'])
const parseFlag = (raw: string): boolean => TRUTHY.has(raw.trim().toLowerCase())

// 2자리 연도는 회원 연령대(1930~2029) 기준으로 세기를 붙인다. 그 외 형식은 행 자체를 버린다.
function normalizeYear(raw: string): string | null {
  const value = raw.trim()
  if (/^\d{4}$/.test(value)) return value
  if (/^\d{2}$/.test(value)) return (Number(value) >= 30 ? '19' : '20') + value
  return null
}

function resolveColumns(header: string[]): Record<HeaderKey, number> {
  const columns = {} as Record<HeaderKey, number>
  const missing: string[] = []
  for (const key of Object.keys(HEADERS) as HeaderKey[]) {
    const index = header.findIndex((cell) => cell.trim() === HEADERS[key])
    if (index === -1 && !OPTIONAL_HEADERS.has(key)) missing.push(HEADERS[key])
    columns[key] = index
  }
  if (missing.length > 0) throw new Error(`roster csv: missing header(s) ${missing.join(', ')}`)
  return columns
}

export function parseRosterCsv(text: string): RosterRow[] {
  const [header, ...body] = parseCsv(text)
  if (!header) throw new Error('roster csv: empty')
  const col = resolveColumns(header)
  const cell = (row: string[], key: HeaderKey) => (col[key] === -1 ? '' : (row[col[key]] ?? '').trim())

  const rows: RosterRow[] = []
  for (const row of body) {
    const name = cell(row, 'name')
    if (!name) continue
    const year = normalizeYear(cell(row, 'year'))
    if (!year) {
      console.warn(`[roster] "${name}" 행 스킵: 출생년도 형식 오류 "${cell(row, 'year')}"`)
      continue
    }
    const rawTier = cell(row, 'tier')
    const tier = toTierType(rawTier)
    if (rawTier && rawTier !== tier) console.warn(`[roster] "${name}" 티어 "${rawTier}" 인식 불가 → ${tier}`)
    const number = Number.parseInt(cell(row, 'number'), 10)
    rows.push({
      name,
      year,
      number: Number.isNaN(number) ? 0 : number,
      tier,
      strength: cell(row, 'strength'),
      attributes: cell(row, 'attributes')
        .split('/')
        .map((attribute) => attribute.trim())
        .filter(Boolean),
      isPremium: parseFlag(cell(row, 'premium'))
    })
  }
  if (rows.length === 0) throw new Error('roster csv: no valid rows')
  return rows
}
