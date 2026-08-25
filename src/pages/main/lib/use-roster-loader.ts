import { useCallback, useEffect } from 'react'
import { App } from 'antd'
import { composeRoster, loadRoster, resetRosterLoader, useRosterStore } from '@/entities'
import type { RosterStatus } from '@/entities'
import { formatDateToKorean } from '@/shared'

// 시트 CSV → 로스터 스토어. 확정(remote/cached/error) 전까지 Container가 자식 마운트를 막아
// 공유링크 복원·선수 목록이 항상 같은 로스터를 보게 한다. error면 Container가 서비스를 차단한다.
export function useRosterLoader(): { status: RosterStatus; retry: () => void } {
  const { message } = App.useApp()
  const status = useRosterStore((state) => state.status)
  const setRoster = useRosterStore((state) => state.setRoster)

  // status가 loading으로 (재)진입할 때마다 fetch. Container는 언마운트되지 않으므로 mount 1회 effect로는 retry가 안 된다.
  useEffect(() => {
    if (status !== 'loading') return
    let cancelled = false
    void loadRoster().then((result) => {
      if (cancelled) return
      setRoster(result.rows, result.status)
      if (result.status === 'cached') {
        const savedAt = result.savedAt ? formatDateToKorean(new Date(result.savedAt)) : '이전에'
        // 기본 3초는 날짜까지 읽기엔 짧다
        message.warning({ content: `최신 명단을 불러오지 못해 ${savedAt} 저장된 명단을 사용합니다`, duration: 6 })
      }
    })
    return () => {
      cancelled = true
    }
  }, [status, setRoster, message])

  const retry = useCallback(() => {
    resetRosterLoader()
    setRoster(composeRoster([]), 'loading')
  }, [setRoster])

  return { status, retry }
}
