import { Button } from 'antd'

import './roster-error.scss'

interface RosterErrorProps {
  onRetry: () => void
}

// fixed 오버레이가 아니라 .app-content 안에 인라인 렌더 — Container가 status==='error'일 때 서비스를 차단하는 빈 상태.
export function RosterError({ onRetry }: RosterErrorProps) {
  return (
    <div className="roster-error">
      <div className="roster-error__card">
        <div className="roster-error__badge" aria-hidden="true">
          <span className="roster-error__ball">⚽</span>
          <span className="roster-error__mark">!</span>
        </div>
        <div className="roster-error__text" role="alert">
          <h2 className="roster-error__title">선수 명단을 불러올 수 없습니다</h2>
          <p className="roster-error__desc">
            구글 시트 응답이 느리거나 일시적으로 문제가 있는 것 같아요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <Button className="roster-error__retry" type="primary" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    </div>
  )
}
