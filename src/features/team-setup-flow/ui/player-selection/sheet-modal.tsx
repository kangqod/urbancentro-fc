import { Button, Modal, Typography } from 'antd'
import { ExternalLink } from 'lucide-react'
import { ROSTER_SHEET_EDIT_URL } from '@/entities'

import './sheet-modal.scss'

interface SheetModalProps {
  isOpen: boolean
  onClose: () => void
}

const ICON_SIZE = 16
const { Paragraph, Text } = Typography

export function SheetModal({ isOpen, onClose }: SheetModalProps) {
  return (
    <Modal title="명단 관리" width={350} open={isOpen} onCancel={onClose} footer={null}>
      <div className="sheet-modal">
        <Paragraph className="sheet-modal__lead">
          선수 명단은 <Text className="sheet-modal__highlight">구글 시트</Text>에서 관리돼요.
          <br />
          시트를 수정하고 앱을 새로고침하면 반영됩니다.
        </Paragraph>
        <ul className="sheet-modal__notes">
          <li>
            반영까지 <Text className="sheet-modal__highlight">최대 5분</Text> 걸릴 수 있어요.
          </li>
          <li>오늘만 함께하는 인원은 게스트 추가를 이용해 주세요.</li>
          <li>편집 권한이 없으면 시트에서 액세스를 요청할 수 있어요.</li>
        </ul>
        <Button
          type="primary"
          size="large"
          block
          href={ROSTER_SHEET_EDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          icon={<ExternalLink size={ICON_SIZE} />}
          onClick={onClose}
          className="sheet-modal__cta"
        >
          구글 시트 열기
        </Button>
      </div>
    </Modal>
  )
}
