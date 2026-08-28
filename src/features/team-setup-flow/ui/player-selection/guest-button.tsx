import { useState } from 'react'
import { Alert, Button, Typography, Switch } from 'antd'

import { Info, UserPlus, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react'
import { ROSTER_SHEET_EDIT_URL } from '@/entities'
import { Tesseract } from '@/features/tesseract'
import { useMediaQuery } from '@/shared'
import { GuestModal } from './guest-modal'
import { SheetModal } from './sheet-modal'
import { useGuestButton } from './guest-button.hooks'

interface GuestButtonProps {
  detailMode: boolean
  onClickDetailMode(): void
}

const ICON_SIZE = 16
const { Text } = Typography

export function GuestButton({ detailMode, onClickDetailMode }: GuestButtonProps) {
  const { status, isModalOpen, form, handleModalOpen } = useGuestButton()
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false)
  // player-selection.scss의 ≤767px 그리드와 같은 경계. 균등 열에 맞추기 위해 라벨 축약·스위치 small.
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <div className="control-panel">
      <div className="control-buttons">
        <Button type="dashed" icon={<UserPlus size={ICON_SIZE} />} onClick={handleModalOpen(true)} className="guest-add-button">
          게스트 추가
        </Button>
        <div className="control-upload">
          <Tesseract />
        </div>
        {ROSTER_SHEET_EDIT_URL && (
          <Button
            type="dashed"
            icon={<FileSpreadsheet size={ICON_SIZE} />}
            onClick={() => setIsSheetModalOpen(true)}
            className="sheet-open-button"
          >
            명단 관리
          </Button>
        )}
        <label className={`detail-switch-container ${detailMode ? 'active' : ''}`} htmlFor="detail-mode-switch">
          <Info size={ICON_SIZE} />
          <Text>{isMobile ? '선수 정보' : '선수 정보 보기'}</Text>
          <Switch
            id="detail-mode-switch"
            size={isMobile ? 'small' : 'medium'}
            checked={detailMode}
            onChange={onClickDetailMode}
            className="detail-switch"
          />
        </label>
      </div>

      <Alert
        showIcon
        title={status.message}
        type={status.type as 'warning' | 'error' | 'success'}
        icon={status.type === 'success' ? <CheckCircle size={ICON_SIZE} /> : <AlertCircle size={ICON_SIZE} />}
        className="status-alert"
      />
      <GuestModal form={form} isModalOpen={isModalOpen} onOpenModal={handleModalOpen} />
      {ROSTER_SHEET_EDIT_URL && <SheetModal isOpen={isSheetModalOpen} onClose={() => setIsSheetModalOpen(false)} />}
    </div>
  )
}
