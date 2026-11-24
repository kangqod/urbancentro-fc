import { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { CircleCheck, Megaphone } from 'lucide-react'
import { TEAMS_PARAMS, useActiveTabValue, useIsSharedViewValue } from '../../lib'
import {
  RELEASE_NOTICE,
  getNoticeId,
  getPendingNotice,
  readSeenNoticeId,
  syncSeenNoticeId,
  writeSeenNoticeId
} from '../../lib/release-notice'
import { TabMenu } from '../../model'

import './release-notice.scss'

const ICON_SIZE = 18

export function ReleaseNotice() {
  const activeTab = useActiveTabValue()
  const isSharedView = useIsSharedViewValue()
  const [dismissed, setDismissed] = useState(false)
  const [{ notice, hasTeamsParam }] = useState(() => {
    const seen = readSeenNoticeId()
    return {
      notice: seen.ok ? getPendingNotice(RELEASE_NOTICE, seen.id) : null,
      // ?teams 값이 깨진 링크도 함께 억제된다 — 드물어 허용.
      hasTeamsParam: new URLSearchParams(window.location.search).has(TEAMS_PARAMS)
    }
  })

  useEffect(() => {
    syncSeenNoticeId(RELEASE_NOTICE)
  }, [])

  const open = !!notice && !dismissed && !hasTeamsParam && !isSharedView && activeTab === TabMenu.TeamSetup

  const handleConfirm = () => {
    if (!notice) return
    writeSeenNoticeId(getNoticeId(notice))
    setDismissed(true)
  }

  return (
    <Modal
      open={open}
      title={
        <div className="release-notice__header">
          <span className="release-notice__icon" aria-hidden>
            <Megaphone size={ICON_SIZE} />
          </span>
          <span className="release-notice__title">업데이트 안내</span>
          {notice && <span className="release-notice__date">{notice.date}</span>}
        </div>
      }
      width={400}
      centered
      closable={false}
      mask={{ closable: false }}
      keyboard={false}
      className="release-notice"
      footer={
        <Button type="primary" size="large" block className="release-notice__cta" onClick={handleConfirm}>
          확인
        </Button>
      }
    >
      {notice && (
        <ul className="release-notice__list">
          {notice.items.map((item) => (
            <li key={item} className="release-notice__item">
              <CircleCheck className="release-notice__check" size={ICON_SIZE} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
