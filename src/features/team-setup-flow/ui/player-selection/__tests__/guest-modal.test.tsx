import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'antd'
import { renderWithProviders, usePlayerStore } from '@/shared/test/render'
import { GuestModal } from '../guest-modal'

// GuestModal은 form/isModalOpen/onOpenModal을 부모에게서 받으므로, 실제 사용처(guest-button.tsx)와
// 동일하게 Form.useForm + useState를 갖는 얇은 래퍼로 감싸 렌더한다.
function Wrapper() {
  const [form] = Form.useForm()
  return <GuestModal form={form} isModalOpen onOpenModal={() => () => {}} />
}

describe('GuestModal', () => {
  it('모달이 열려 있으면 throw 없이 마운트되고 입력 필드가 보인다', () => {
    renderWithProviders(<Wrapper />)

    expect(screen.getByText('게스트 추가')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('게스트 이름')).toBeInTheDocument()
  })

  // name Form.Item이 Input+안내문구를 Flex로 단일 자식 래핑해 antd가 value/onChange를 정상 주입한다(회귀 수정 완료).
  it('이름을 입력하고 제출하면 게스트 선수가 스토어에 추가된다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Wrapper />)

    await user.type(screen.getByPlaceholderText('게스트 이름'), '홍길동')
    await user.click(screen.getByRole('button', { name: '추가하기' }))

    await waitFor(() => {
      expect(usePlayerStore.getState().players.some((p) => p.name === '홍길동' && p.isGuest)).toBe(true)
    })
  })
})
