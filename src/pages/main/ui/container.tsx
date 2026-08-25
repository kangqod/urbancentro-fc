import { Button, Result } from 'antd'
import { TeamSetupFlow } from '@/features'
import { LoadingOverlay } from '@/shared'
import { useTeamInitializationFromUrl, useBuildVersionCheck, useRosterLoader } from '../lib'

// URL 복원 effect는 로스터가 확정된 뒤에만 실행돼야 하므로 게이트 안쪽 컴포넌트에서 호출한다.
function ReadyContainer() {
  useTeamInitializationFromUrl()

  return <TeamSetupFlow />
}

export function Container() {
  const { status, retry } = useRosterLoader()
  // 로스터 에러 화면에 갇힌 사용자도 핫픽스 배포를 안내받아야 하므로 게이트 바깥에서 검사한다.
  useBuildVersionCheck()

  if (status === 'loading') {
    return <LoadingOverlay title="선수 명단을 불러오고 있어요" />
  }

  if (status === 'error') {
    return (
      <Result
        className="roster-error"
        status="error"
        title="선수 명단을 불러올 수 없습니다"
        subTitle="네트워크 연결을 확인한 뒤 다시 시도해 주세요."
        extra={
          <Button type="primary" onClick={retry}>
            다시 시도
          </Button>
        }
      />
    )
  }

  return <ReadyContainer />
}
