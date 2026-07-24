import { useEffect } from 'react'
import { App } from 'antd'
import { runBuildVersionCheck } from '@/shared'
import { TEAMS_PARAMS } from '@/features'

// 탭 복귀·bfcache 복원마다 재검사하되, 이 간격보다 짧게 연달아 오는 요청은 합쳐 build.json 연타 fetch를 막는다.
const BUILD_CHECK_THROTTLE_MS = 30_000

// 공유 진입(?teams)·비프로덕션은 제외. build.json(서버 최신)을 번들 주입값과 비교해 새 버전이면 차단형 모달.
export function useBuildVersionCheck() {
  const { modal } = App.useApp()

  useEffect(() => {
    if (!import.meta.env.PROD) return
    if (new URLSearchParams(window.location.search).get(TEAMS_PARAMS)) return

    // 모달이 한 번 뜨면 reload 전까지 절대 닫히지 않으므로, 그 뒤 추가 배포를 감지해도 중복으로 쌓지 않는다.
    let modalShown = false
    let lastCheckedAt = 0

    // 가운데 차단형 모달 — 닫기 X·마스크 클릭·ESC 모두 막고 새로고침만 허용. onOk가 미해결 Promise라
    // 실제 reload 전까지 모달이 절대 닫히지 않는다.
    const onUpdate = () => {
      if (modalShown) return
      modalShown = true
      modal.confirm({
        title: '새 버전이 배포되었어요',
        content: '계속 이용하려면 새로고침이 필요합니다.',
        centered: true,
        mask: {
          closable: false
        },
        keyboard: false,
        okText: '새로고침',
        cancelButtonProps: { style: { display: 'none' } },
        onOk: () => {
          window.location.reload()
          return new Promise<void>(() => {})
        }
      })
    }

    const check = () => {
      const now = Date.now()
      if (now - lastCheckedAt < BUILD_CHECK_THROTTLE_MS) return
      lastCheckedAt = now
      void runBuildVersionCheck({ onUpdate })
    }

    check()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        check()
      }
    }
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        check()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [modal])
}
