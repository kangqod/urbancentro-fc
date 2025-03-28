import { Button, Modal, Input, Form, type FormInstance } from 'antd'
import { UserPlus } from 'lucide-react'
import { useGuestModal } from './guest-modal.hooks'

interface GuestModalProps {
  form: FormInstance<any>
  isModalOpen: boolean
  onOpenModal: (value: boolean) => () => void
}

const ICON_SIZE = 16

export function GuestModal({ form, isModalOpen, onOpenModal }: GuestModalProps) {
  const { onFinish } = useGuestModal({ form, onOpenModal })

  return (
    <Modal title="게스트 추가" width={350} open={isModalOpen} onCancel={onOpenModal(false)} footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력해주세요' }]}>
          <Input placeholder="게스트 이름" />
        </Form.Item>
        <Form.Item className="modal-footer">
          <Button type="primary" htmlType="submit" icon={<UserPlus size={ICON_SIZE} />} className="add-guest-button">
            추가하기
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
