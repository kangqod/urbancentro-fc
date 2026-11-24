import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { App as AntdApp } from 'antd'
import { composeRoster, useRosterStore } from '@/entities/player/model/roster-store'
import { usePlayerStore } from '@/entities/player/model/store'
import type { Player, RosterRow } from '@/entities/player/model/types'
import { useTesseract } from '../useTesseract'

const ocr = vi.hoisted(() => ({ text: '' }))

vi.mock('tesseract.js', () => ({
  createWorker: async () => ({
    recognize: async () => ({ data: { text: ocr.text } }),
    terminate: async () => {}
  })
}))

const ROSTER: RosterRow[] = [
  { year: '1990', number: 1, name: '박치환', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: '1989', number: 2, name: '이원식', tier: '중급', strength: '', attributes: [], isPremium: false },
  { year: '1992', number: 3, name: '홍길동', tier: '중급', strength: '', attributes: [], isPremium: false }
]

const makePlayer = (row: RosterRow, isActiveForMatch: boolean): Player =>
  ({
    id: `p${row.number}`,
    name: row.name,
    year: row.year,
    number: row.number,
    isGuest: false,
    isActiveForMatch
  }) as Player

const wrapper = ({ children }: { children: ReactNode }) => <AntdApp>{children}</AntdApp>

const activeNames = () =>
  usePlayerStore
    .getState()
    .players.filter((p) => p.isActiveForMatch)
    .map((p) => p.name)

const upload = async (text: string) => {
  ocr.text = text
  const hook = renderHook(() => useTesseract(), { wrapper })
  await act(async () => {
    hook.result.current.beforeUpload(new File(['x'], 'a.png'))
  })
  await waitFor(() => expect(hook.result.current.loading).toBe(false))
  return hook
}

describe('useTesseract', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()
    useRosterStore.setState({ rows: composeRoster(ROSTER), status: 'remote' })
    usePlayerStore.setState({
      players: [makePlayer(ROSTER[0], false), makePlayer(ROSTER[1], true), makePlayer(ROSTER[2], true)],
      isOCR: false
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('매칭이 있으면 선택을 반영하고 review를 설정하며 reviewId를 올린다', async () => {
    const { result } = await upload('박치환 이원식')
    expect(activeNames()).toEqual(['박치환', '이원식'])
    expect(usePlayerStore.getState().isOCR).toBe(true)
    expect(result.current.review?.matches.map((m) => m.player.name)).toEqual(['박치환', '이원식'])
    expect(result.current.reviewId).toBe(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('매칭 0건에 미인식만 있으면 선택을 유지하고 review에 unmatched를 담는다', async () => {
    const { result } = await upload('김철수')
    expect(activeNames()).toEqual(['이원식', '홍길동'])
    expect(usePlayerStore.getState().isOCR).toBe(false)
    expect(result.current.review?.matches).toEqual([])
    expect(result.current.review?.unmatched.length).toBeGreaterThan(0)
    expect(result.current.reviewId).toBe(1)
  })

  it('결과가 모두 비면 review는 null이고 선택은 유지된다', async () => {
    const { result } = await upload('')
    expect(result.current.review).toBeNull()
    expect(result.current.reviewId).toBe(0)
    expect(activeNames()).toEqual(['이원식', '홍길동'])
    expect(usePlayerStore.getState().isOCR).toBe(false)
  })

  it('closeReview는 review를 null로 만든다', async () => {
    const { result } = await upload('박치환')
    expect(result.current.review).not.toBeNull()
    act(() => result.current.closeReview())
    expect(result.current.review).toBeNull()
  })
})
