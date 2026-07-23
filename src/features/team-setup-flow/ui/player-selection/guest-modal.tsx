import { Button, Modal, Input, Form, type FormInstance, Select, Flex, Typography } from 'antd'
import { UserPlus } from 'lucide-react'
import { useGuestModal } from './guest-modal.hooks'
import { DEFAULT_TIER } from '@/entities'

import './guest-modal.scss'

interface GuestModalProps {
  form: FormInstance<any>
  isModalOpen: boolean
  onOpenModal: (value: boolean) => () => void
}

const ICON_SIZE = 16

export function GuestModal({ form, isModalOpen, onOpenModal }: GuestModalProps) {
  const { onFinish, playerOptions, tierOptions, handlePlayerSelect, handleClose } = useGuestModal({ form, onOpenModal })

  return (
    <Modal title="게스트 추가" width={350} open={isModalOpen} onCancel={handleClose} footer={null}>
      <Form form={form} layout="vertical" size="large" onFinish={onFinish} className="guest-modal-form">
        <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력해주세요' }]}>
          <Flex vertical>
            <Input placeholder="게스트 이름" className="input-guest-name" maxLength={5} />
            <Typography.Text type="secondary" className="text-guest-modal-note">
              ※ <span className="span-guest-modal-highlight">최대 5글자</span>까지 입력 가능합니다.
            </Typography.Text>
          </Flex>
        </Form.Item>

        <Form.Item name="matchedPlayer" label="매칭할 선수 선택">
          <Flex vertical>
            <Select
              allowClear
              showSearch={{
                optionFilterProp: 'children',
                filterOption: (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }}
              placeholder="기존 선수 중 선택하세요"
              options={playerOptions}
              onChange={handlePlayerSelect}
            />
            <Typography.Text type="secondary" className="text-guest-modal-note">
              ※ 선수 1명당 게스트는 원할한 팀 분리를 위해 <span className="span-guest-modal-highlight">최대 2명</span> 까지 등록 가능합니다.
            </Typography.Text>
          </Flex>
        </Form.Item>

        <Form.Item name="tier" label="실력" initialValue={DEFAULT_TIER}>
          <Select options={tierOptions} />
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
