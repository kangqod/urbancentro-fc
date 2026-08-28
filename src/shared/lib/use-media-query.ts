import { useSyncExternalStore } from 'react'

// antd Grid.useBreakpoint는 리사이즈에 반응하지 않는 케이스가 있어(실측) matchMedia를 직접 구독한다. SSR/테스트 스텁에선 false.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}
