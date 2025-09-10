import { type ReactNode } from 'react'
import { message } from 'antd'
import { PLAYER_CONDITIONS, shareKakao } from '@/entities'
import { getTeamsText, useTeamsValue } from '../../lib'
import { TabMenu, useTeamSetupFlowStore } from '../../model'

export function useFooter() {
  const teams = useTeamsValue()
  const { setActiveTab } = useTeamSetupFlowStore()

  const [messageApi, contextHolder] = message.useMessage()

  const handleNativeShare = async () => {
    try {
      const shareText = getTeamsText(teams)

      if (navigator.share) {
        await navigator.share({
          title: '팀 분배 결과',
          text: shareText
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        messageApi.success('클립보드에 복사되었습니다.')
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message !== 'Share canceled') {
        messageApi.error('공유에 실패했습니다.')
      }
      console.error('공유 실패 :', (error as Error).message)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      const shareText = getTeamsText(teams)
      await navigator.clipboard.writeText(shareText)
      messageApi.success('클립보드에 복사되었습니다.')
    } catch (error) {
      messageApi.error('복사에 실패했습니다.')
    }
  }

  const handleShareKakao = () => {
    const teamsData: any = teams.map((team) => [
      team.name.slice(-1), // "팀 A" -> "A"
      team.players.map(
        (player) =>
          `${player.year ? `${player.year.slice(-2)}` : '99'}-${player.name}-${
            player.condition === PLAYER_CONDITIONS.HIGH ? PLAYER_CONDITIONS.HIGH : ''
          }`
      )
    ])

    const description = getTeamsText(teams)

    shareKakao({
      teams: teamsData,
      description
    })
  }

  function handlePrevClick() {
    setActiveTab(TabMenu.PlayerSelection)
  }

  return {
    contextHolder: contextHolder as ReactNode,
    handleNativeShare,
    handleCopyToClipboard,
    handleShareKakao,
    handlePrevClick
  }
}
