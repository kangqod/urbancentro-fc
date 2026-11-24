export interface ReleaseNotice {
  date: string
  items: string[]
}

// 최신 공지 1건만 보관한다 — 새 공지는 이전 내용을 덮어쓰고, 공지할 게 없으면 null. id는 내용에서 자동 생성되므로 따로 적지 않는다.
export const RELEASE_NOTICE: ReleaseNotice | null = {
  date: '2026.11.24',
  items: [
    '이미지로 선수를 불러오면 반영된 선수와 인식하지 못한 이름을 알려줘요.',
    "팀 분배 후 '자리 바꾸기'로 두 선수의 팀을 서로 바꿀 수 있어요."
  ]
}

export const RELEASE_NOTICE_SEEN_KEY = 'release-notice-seen'

export type SeenNoticeResult = { ok: true; id: string | null } | { ok: false }

// 날짜+항목의 FNV-1a 해시 — 같은 날 공지를 다시 내도 내용이 다르면 id가 달라져 재표시된다(문구만 고쳐도 재표시).
export function getNoticeId(notice: ReleaseNotice): string {
  const text = [notice.date, ...notice.items].join('\n')
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

export function getPendingNotice(notice: ReleaseNotice | null, seenId: string | null): ReleaseNotice | null {
  if (!notice || getNoticeId(notice) === seenId) return null
  return notice
}

// localStorage는 사파리 프라이빗 모드 등에서 접근 자체가 throw 할 수 있어 try로 감싼다. 읽기 실패는 표시하지 않는 쪽으로 처리.
export function readSeenNoticeId(): SeenNoticeResult {
  try {
    return { ok: true, id: localStorage.getItem(RELEASE_NOTICE_SEEN_KEY) }
  } catch {
    return { ok: false }
  }
}

// 단일 키를 덮어써 이력이 쌓이지 않는다. 쓰기 실패 시 다음 진입에 재표시될 뿐이라 무시.
export function writeSeenNoticeId(id: string): void {
  try {
    localStorage.setItem(RELEASE_NOTICE_SEEN_KEY, id)
  } catch {
    // 무시
  }
}

export function clearSeenNoticeId(): void {
  try {
    localStorage.removeItem(RELEASE_NOTICE_SEEN_KEY)
  } catch {
    // 무시
  }
}

export function syncSeenNoticeId(notice: ReleaseNotice | null): void {
  if (notice === null) clearSeenNoticeId()
}
