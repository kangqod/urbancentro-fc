import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { ConfigProvider } from 'antd'
import { act, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/shared/test/render'
import { RELEASE_NOTICE, RELEASE_NOTICE_SEEN_KEY, getNoticeId } from '../../../lib/release-notice'
import { TabMenu, useTeamSetupFlowStore } from '../../../model'
import { ReleaseNotice } from '../release-notice'

// jsdom에선 모달 퇴장 모션이 끝나지 않아 닫힘 단언을 위해 모션을 끈다.
const renderNotice = () =>
  renderWithProviders(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <ReleaseNotice />
    </ConfigProvider>
  )

const initialUrl = window.location.href

describe('ReleaseNotice', () => {
  beforeEach(() => {
    localStorage.clear()
    act(() => {
      useTeamSetupFlowStore.setState({ activeTab: TabMenu.TeamSetup, isSharedView: false })
    })
  })

  afterEach(() => {
    window.history.replaceState(null, '', initialUrl)
  })

  it('미확인 + 팀 구성 탭이면 모달이 보이고 닫기 버튼이 없다', async () => {
    renderNotice()

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
  })

  it("'확인'하면 id가 저장되고 모달이 사라지며, 재마운트해도 뜨지 않는다", async () => {
    const user = userEvent.setup()
    const { unmount } = renderNotice()

    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: '확인' }))

    expect(localStorage.getItem(RELEASE_NOTICE_SEEN_KEY)).toBe(RELEASE_NOTICE && getNoticeId(RELEASE_NOTICE))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    unmount()
    renderNotice()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('?teams URL이면 뜨지 않는다', () => {
    window.history.replaceState(null, '', '/?teams=%5B%5D')
    renderNotice()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('isSharedView가 true면 뜨지 않는다', () => {
    act(() => {
      useTeamSetupFlowStore.setState({ isSharedView: true })
    })
    renderNotice()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('팀 구성 외 탭이면 뜨지 않는다', () => {
    act(() => {
      useTeamSetupFlowStore.setState({ activeTab: TabMenu.PlayerSelection })
    })
    renderNotice()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
