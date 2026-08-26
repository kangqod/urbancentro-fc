import type { ReactNode } from 'react'

import './loading-overlay.scss'

interface LoadingOverlayProps {
  title: string
  description?: string
  children?: ReactNode
}

// 전체화면 딤 + 카드 + 굴러가는 ⚽. 로스터 로딩·OCR 진행 오버레이가 공유한다.
// <AntdApp> 하위에 인라인 렌더되므로 antd CSS 변수가 그대로 해석된다(Spin fullscreen의 body 포털 트랩 회피).
export function LoadingOverlay({ title, description, children }: LoadingOverlayProps) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-overlay__card">
        <div className="loading-overlay__ball" aria-hidden="true">
          ⚽
        </div>
        <div className="loading-overlay__text">
          <p className="loading-overlay__title">{title}</p>
          {description && <p className="loading-overlay__desc">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
