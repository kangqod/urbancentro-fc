import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// antd responsiveObserver가 matchMedia 사용 → jsdom 미구현이라 stub 필수
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
}
// antd 내부 컴포넌트가 종종 요구
if (!window.ResizeObserver) {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }))
}

// antd Wave/Modal이 getComputedStyle(node, '::before')를 호출하면 jsdom이 "Not implemented" 노이즈를 낸다.
// 콘솔 필터로는 못 막는다(jsdom virtualConsole가 원본 console을 캡처). 의사요소 인자를 떼서 미구현 경로 자체를 회피.
const origGetComputedStyle = window.getComputedStyle.bind(window)
window.getComputedStyle = ((elt: Element, _pseudoElt?: string | null) => origGetComputedStyle(elt)) as typeof window.getComputedStyle

afterEach(() => {
  cleanup()
})
