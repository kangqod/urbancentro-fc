import { type Player } from '@/entities'
import playerData from '@/shared/assets/data.json'

function handlePlayerException(name: string, usedNames: Set<string>, results: Pick<Player, 'name' | 'year'>[]) {
  if (name === '박지환' || name === '박치환') {
    const item = playerData.find((p) => p.name === '박치환' && p.year === '1990')
    if (item && !usedNames.has(item.name)) {
      results.push(item)
      usedNames.add(item.name)
    }
  } else if (name === '이원식' || name === '원식') {
    const item = playerData.find((p) => p.name === '이원식' && p.year === '1989')
    if (item && !usedNames.has(item.name)) {
      results.push(item)
      usedNames.add(item.name)
    }
  } else if (name === '이원재' || name === '원재') {
    const item = playerData.find((p) => p.name === '이원재' && p.year === '1989')
    if (item && !usedNames.has(item.name)) {
      results.push(item)
      usedNames.add(item.name)
    }
  } else if (name === '이한별' || name === '한별') {
    const item = playerData.find((p) => p.name === '이한별' && p.year === '1989')
    if (item && !usedNames.has(item.name)) {
      results.push(item)
      usedNames.add(item.name)
    }
  } else if (name === '이민수' || name === '민수') {
    const item = playerData.find((p) => p.name === '이민수' && p.year === '1989')
    if (item && !usedNames.has(item.name)) {
      results.push(item)
      usedNames.add(item.name)
    }
  } else {
    //
  }
}

export function extractMatchedPlayersUnified(text: string) {
  // "불참" 이전까지만 추출
  const beforeAbsent = text.split(/불참/)[0]

  // 1. 생년/이름 패턴 추출 (예: 87/홍길동)
  const yearNameMatches = [...beforeAbsent.matchAll(/(\d{2})\/([가-힣]{2,})/g)]
  // 2. 이름만 추출 (예: 홍길동)
  const nameMatches = [...beforeAbsent.matchAll(/([가-힣]{2,})/g)]

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
