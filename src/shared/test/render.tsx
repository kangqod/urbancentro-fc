import type { ReactElement, ReactNode } from 'react'
import { render, act, type RenderResult } from '@testing-library/react'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { afterEach } from 'vitest'
import { PRIMARY_COLOR } from '@/shared'
import { useTeamStore } from '@/entities/team/model/store'
import { usePlayerStore } from '@/entities/player/model/store'

// src/app/Provider.tsx와 동일한 antd 토큰(색/모션)만 재사용 — SCSS는 jsdom에서 무시되므로 스타일 단언은 하지 않는다
// eslint-disable-next-line react-refresh/only-export-components -- 테스트 전용 유틸이라 Fast Refresh 대상 아님
function TestProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: PRIMARY_COLOR }
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}

export function renderWithProviders(ui: ReactElement): RenderResult {
  return render(ui, { wrapper: TestProviders })
}

const initialTeamState = useTeamStore.getState()
const initialPlayerState = usePlayerStore.getState()

// zustand 싱글턴 스토어는 테스트 간 상태가 새지 않도록 매 테스트 종료 후 초기 상태로 리셋한다.
// 이 afterEach는 RTL cleanup보다 먼저 실행돼(마운트 상태) 구독 컴포넌트를 재렌더시키므로 act로 감싼다.
afterEach(() => {
  act(() => {
    useTeamStore.setState(initialTeamState, true)
    usePlayerStore.setState(initialPlayerState, true)
  })
})

export { useTeamStore, usePlayerStore }
