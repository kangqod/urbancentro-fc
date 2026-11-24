import { getRosterRows, type Player } from '@/entities'

// OCR 오인식·약칭 → 로스터 이름. 시트에서 연도가 바뀌어도 매칭이 깨지지 않도록 이름만으로 찾는다.
const NAME_ALIASES: Readonly<Record<string, string>> = {
  박지환: '박치환',
  박치환: '박치환',
  이원식: '이원식',
  원식: '이원식',
  이원재: '이원재',
  원재: '이원재',
  이한별: '이한별',
  한별: '이한별',
  이민수: '이민수',
  민수: '이민수'
}

const UNMATCHED_MIN_LENGTH = 2
const UNMATCHED_MAX_LENGTH = 4
// 카톡 투표 결과 화면의 UI 문구 — 이름이 아니므로 미인식 목록에서 뺀다.
const VOTE_UI_WORDS: ReadonlySet<string> = new Set(['투표', '투표가', '현황', '항목별', '멤버별', '참석'])

export type OcrMatchKind = 'exact' | 'alias' | 'prefix'

export interface OcrMatch {
  player: Pick<Player, 'name' | 'year'>
  kind: OcrMatchKind
  raw: string
}

export interface OcrExtraction {
  matches: OcrMatch[]
  unmatched: string[]
}

// 별칭이 로스터 행에 닿았는지 반환한다(push 여부와 무관) — 미인식 판정용.
function handlePlayerException(name: string, usedNames: Set<string>, results: OcrMatch[]) {
  const canonical = NAME_ALIASES[name]
  if (!canonical) return false
  const item = getRosterRows().find((p) => p.name === canonical)
  if (item && !usedNames.has(item.name)) {
    results.push({ player: item, kind: 'alias', raw: name })
    usedNames.add(item.name)
  }
  return !!item
}

export function extractOcrCandidates(text: string): OcrExtraction {
  // "불참" 이전까지만 추출
  const beforeAbsent = text.split(/불참/)[0]

  // 1. 생년/이름 패턴 추출 (예: 87/홍길동)
  const yearNameMatches = [...beforeAbsent.matchAll(/(\d{2})\/([가-힣]{2,})/g)]
  // 2. 이름만 추출 (예: 홍길동)
  const nameMatches = [...beforeAbsent.matchAll(/([가-힣]{2,})/g)]

  const playerData = getRosterRows()
  const results: OcrMatch[] = []
  const usedNames: Set<string> = new Set()
  const unmatchedCandidates: string[] = []

  // 1. 생년/이름 매칭
  for (const [, , name] of yearNameMatches) {
    const matched = playerData.find((p) => p.name === name)
    if (matched && !usedNames.has(matched.name)) {
      results.push({ player: matched, kind: 'exact', raw: name })
      usedNames.add(matched.name)
    } else if (!usedNames.has(name)) {
      handlePlayerException(name, usedNames, results)
    }
  }

  // 2. 이름만 매칭 (이미 추가된 이름은 제외)
  for (const [name] of nameMatches) {
    if (usedNames.has(name)) continue
    let matched = playerData.find((p) => p.name === name)
    let kind: OcrMatchKind = 'exact'
    if (!matched) {
      matched = playerData.find((p) => p.name.slice(0, 2) === name.slice(0, 2))
      kind = 'prefix'
    }
    if (matched && !usedNames.has(matched.name)) {
      results.push({ player: matched, kind, raw: name })
      usedNames.add(matched.name)
    }
    const aliasReached = handlePlayerException(name, usedNames, results)
    if (!matched && !aliasReached) unmatchedCandidates.push(name)
  }

  const excluded = new Set(results.flatMap((m) => [m.player.name, m.raw]))
  const unmatched = [
    ...new Set(
      unmatchedCandidates.filter(
        (token) =>
          token.length >= UNMATCHED_MIN_LENGTH && token.length <= UNMATCHED_MAX_LENGTH && !excluded.has(token) && !VOTE_UI_WORDS.has(token)
      )
    )
  ]

  return { matches: results, unmatched }
}
