import type { RosterRow } from './types'
import { DEFAULT_YEAR } from './player'

// "지원 1/2"는 밸런싱(EXCLUDED_PAIRS·CONDITION_EXEMPT_NAMES)·공유링크 복원에 이름으로 엮인 슬롯이라
// 시트가 아닌 코드에 고정한다. year=DEFAULT_YEAR 센티널로 기본 미선택 처리된다.
export const SUPPORT_SLOTS: readonly RosterRow[] = [
  { year: DEFAULT_YEAR, number: 0, name: '지원 1', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: DEFAULT_YEAR, number: 0, name: '지원 2', tier: '중급', strength: '', attributes: [], isPremium: false }
]
