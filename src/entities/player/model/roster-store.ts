import { create } from 'zustand'
import { SUPPORT_SLOTS } from './support-slots'
import type { RosterRow, RosterStatus } from './types'

const SUPPORT_NAMES: ReadonlySet<string> = new Set(SUPPORT_SLOTS.map((slot) => slot.name))

// 원격 성공·캐시 복원 경로가 모두 이 함수를 거쳐야 지원 슬롯이 어디서도 빠지지 않는다.
// 시트에 같은 이름이 남아 있어도 코드 상수만 유효 — 중복 카드·이름 매칭 충돌 방지.
export const composeRoster = (rows: readonly RosterRow[]): RosterRow[] => [
  ...SUPPORT_SLOTS,
  ...rows.filter((row) => !SUPPORT_NAMES.has(row.name))
]

interface RosterStore {
  rows: RosterRow[]
  status: RosterStatus
  setRoster: (rows: RosterRow[], status: RosterStatus) => void
}

export const useRosterStore = create<RosterStore>((set) => ({
  rows: composeRoster([]),
  status: 'loading',
  setRoster: (rows, status) => set({ rows, status })
}))

// 리액트 밖(공유링크 파서·OCR 매칭)에서 현재 로스터를 읽는 진입점.
export const getRosterRows = (): RosterRow[] => useRosterStore.getState().rows
