import { Alert, Button, Typography, Switch } from 'antd'

import { NotepadText, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { Tesseract } from '@/features/tesseract'
import { GuestModal } from './guest-modal'
import { useGuestButton } from './guest-button.hooks'

interface GuestButtonProps {
  detailMode: boolean
  onClickDetailMode(): void
}

const ICON_SIZE = 16
const { Text } = Typography

export function GuestButton({ detailMode, onClickDetailMode }: GuestButtonProps) {
  const { status, isModalOpen, form, handleModalOpen } = useGuestButton()

  return (
    <div className="control-panel">
      <div className="control-buttons">
        <Button type="dashed" icon={<Plus size={ICON_SIZE} />} onClick={handleModalOpen(true)} className="guest-add-button">
          게스트 추가
        </Button>
        <div>
          <Tesseract />
        </div>
        <div className="detail-switch-container" onClick={onClickDetailMode}>
          <NotepadText size={ICON_SIZE} />
          <Text>상세 보기</Text>
          <Switch checked={detailMode} className="detail-switch" />
        </div>
      </div>

      <Alert
        showIcon
        message={status.message}
        type={status.type as 'warning' | 'error' | 'success'}
        icon={status.type === 'success' ? <CheckCircle size={ICON_SIZE} /> : <AlertCircle size={ICON_SIZE} />}
        className="status-alert"
      />
      <GuestModal form={form} isModalOpen={isModalOpen} onOpenModal={handleModalOpen} />
    </div>
  )
}
