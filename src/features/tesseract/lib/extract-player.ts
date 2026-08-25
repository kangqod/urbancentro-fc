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

function handlePlayerException(name: string, usedNames: Set<string>, results: Pick<Player, 'name' | 'year'>[]) {
  const canonical = NAME_ALIASES[name]
  if (!canonical) return
  const item = getRosterRows().find((p) => p.name === canonical)
  if (item && !usedNames.has(item.name)) {
    results.push(item)
    usedNames.add(item.name)
  }
}

export function extractMatchedPlayersUnified(text: string) {
  // "불참" 이전까지만 추출
  const beforeAbsent = text.split(/불참/)[0]

  // 1. 생년/이름 패턴 추출 (예: 87/홍길동)
  const yearNameMatches = [...beforeAbsent.matchAll(/(\d{2})\/([가-힣]{2,})/g)]
  // 2. 이름만 추출 (예: 홍길동)
  const nameMatches = [...beforeAbsent.matchAll(/([가-힣]{2,})/g)]

  const playerData = getRosterRows()
  const results: Pick<Player, 'name' | 'year'>[] = []
  const usedNames: Set<string> = new Set()

  // 1. 생년/이름 매칭
  for (const [, , name] of yearNameMatches) {
    const matched = playerData.find((p) => p.name === name)
    if (matched && !usedNames.has(matched.name)) {
      results.push(matched)
      usedNames.add(matched.name)
    } else if (!usedNames.has(name)) {
      handlePlayerException(name, usedNames, results)
    }
  }

  // 2. 이름만 매칭 (이미 추가된 이름은 제외)
  for (const [name] of nameMatches) {
    if (usedNames.has(name)) continue
    let matched = playerData.find((p) => p.name === name)
    if (!matched) {
      matched = playerData.find((p) => p.name.slice(0, 2) === name.slice(0, 2))
    }
    if (matched && !usedNames.has(matched.name)) {
      results.push(matched)
      usedNames.add(matched.name)
    }
    handlePlayerException(name, usedNames, results)
  }

  return results
}
