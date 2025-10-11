export function teamNameToNumber(teamName: string): number | null {
  // '팀 A' -> 1, '팀 B' -> 2 ...
  const match = teamName.match(/^팀\s*([A-Z])$/)
  if (!match) return null
  return alphaToNumber(match[1])
}

export function alphaToNumber(char: string) {
  return char.charCodeAt(0) - 64
}

export function numberToAlpha(num: number) {
  return String.fromCharCode(num + 64)
}
