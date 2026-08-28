import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMediaQuery } from '../use-media-query'

type Listener = (event: { matches: boolean }) => void

// setup.ts의 matchMedia 스텁은 matches=false 고정이라, change 이벤트를 흘릴 수 있는 페이크로 교체한다.
function installMatchMedia(initial: boolean) {
  const listeners = new Set<Listener>()
  let matches = initial
  const original = window.matchMedia
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_: string, listener: Listener) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
  return {
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((listener) => listener({ matches: next }))
    },
    listenerCount: () => listeners.size,
    restore: () => {
      window.matchMedia = original
    }
  }
}

describe('useMediaQuery', () => {
  let restore = () => {}
  afterEach(() => restore())

  it('초기 matches 값을 반환한다', () => {
    const mm = installMatchMedia(true)
    restore = mm.restore
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'))
    expect(result.current).toBe(true)
  })

  it('change 이벤트에 반응해 값이 바뀌고, 언마운트 시 리스너를 해제한다', () => {
    const mm = installMatchMedia(false)
    restore = mm.restore
    const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 767px)'))
    expect(result.current).toBe(false)

    act(() => mm.setMatches(true))
    expect(result.current).toBe(true)

    act(() => mm.setMatches(false))
    expect(result.current).toBe(false)

    expect(mm.listenerCount()).toBeGreaterThan(0)
    unmount()
    expect(mm.listenerCount()).toBe(0)
  })
})
