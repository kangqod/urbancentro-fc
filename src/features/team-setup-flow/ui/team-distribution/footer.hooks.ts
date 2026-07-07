import { type MouseEvent, type ReactNode } from 'react'
import { message } from 'antd'
import { PLAYER_CONDITIONS, shareKakao } from '@/entities'
import type { Team } from '@/entities'
import { getTeamsText, useTeamsValue, type SharedPlayer, type SharedTeam } from '../../lib'
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
    // 플레이어를 [year, name, condition, tier, isGuest] 배열로 직렬화한다.
    // tier와 isGuest를 항상 담아, 복원 시 로스터에서 못 찾은 선수도 등급과
    // 게스트 여부를 잃지 않게 한다. 이름에 `-`가 포함되어도 필드가 어긋나지 않는다.
    const teamsData = teams.map(
      (team): SharedTeam => [
        team.name.slice(-1), // "팀 A" -> "A"
        team.players.map(
          (player): SharedPlayer => [
            player.year ? player.year.slice(-2) : '99',
            player.name,
            player.condition === PLAYER_CONDITIONS.HIGH ? PLAYER_CONDITIONS.HIGH : '',
            player.tier,
            player.isGuest
          ]
        )
      ]
    )

    const description = getTeamsText(teams)

    // ShareKakaoContent.teams는 Team[]로 선언돼 있으나 링크에는 직렬화 튜플을 싣는다.
    // (직렬화 포맷 타입을 entities로 끌어올리면 FSD 계층을 침범하므로 경계에서만 캐스팅)
    shareKakao({
      teams: teamsData as unknown as Team[],
      description
    })
  }

  function handlePrevClick(event?: MouseEvent<HTMLElement>) {
    event?.currentTarget.blur()
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
