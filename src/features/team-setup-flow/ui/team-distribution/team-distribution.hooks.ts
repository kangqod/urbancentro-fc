import { useEffect, useState, useRef } from 'react'
import { message } from 'antd'
import { balanceTeams } from '@/entities'
import type { MatchFormatType, Team } from '@/entities'
import { parseSharedTeams, useTeamDistributionValue, useTeamsState, useGetAvailablePlayersState, TEAMS_PARAMS } from '../../lib'
import { TabMenu } from '../../model'

function getUserFriendlyErrorMessage(error: unknown): string {
  const fallback = '팀 분배 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.'

  if (!(error instanceof Error)) return fallback

  const message = error.message

  if (message.includes('선수 인원이 올바르지 않습니다') || message.includes('Invalid player count')) {
    return '선수 수가 맞지 않아요. 체크된 선수를 다시 확인해주세요.'
  }

  if (
    message.includes('Invalid match format mode') ||
    message.includes('Unsupported match format mode') ||
    message.includes('no capacity for connected guest')
  ) {
    return '현재 팀 구성을 만들 수 없어요. 선수 선택을 다시 확인해주세요.'
  }

  if (message.includes('duplicate player ids')) {
    return '선수 데이터에 중복이 있어요. 새로고침 후 다시 시도해주세요.'
  }

  return fallback
}

export function useTeamDistribution() {
  const { isSharedView, activeTab } = useTeamDistributionValue()
  const { teamCount, setTeams } = useTeamsState()

  const getAvailablePlayers = useGetAvailablePlayersState()

  const [isShuffle, setIsShuffle] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  const isFirstRenderRef = useRef<boolean>(false)

  const distributeTeamsFromSharedLink = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const teamsParam = searchParams.get(TEAMS_PARAMS)
      const sharedTeams = parseSharedTeams(teamsParam)

      if (sharedTeams) {
        setTeams(sharedTeams)
      }
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error)
      messageApi.error(errorMessage)
    } finally {
      setIsShuffle(false)
    }
  }

  const distributeTeamsLocally = async () => {
    try {
      const availablePlayers = getAvailablePlayers()
      const playersPerTeam = Math.ceil(availablePlayers.length / teamCount)
      const mode = Array(teamCount).fill(playersPerTeam).join(':') as MatchFormatType
      const requiredTotalPlayers = teamCount * playersPerTeam

      if (availablePlayers.length !== requiredTotalPlayers) {
        throw new Error(`선수 인원이 올바르지 않습니다. ${requiredTotalPlayers}명을 선택해주세요.`)
      }

      const newTeams = await new Promise<Team[]>((resolve) => {
        setTimeout(() => {
          const balancedTeams = balanceTeams(availablePlayers, mode)
          resolve(balancedTeams)
        }, 800)
      })

      setTeams(newTeams)
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error)
      messageApi.error(errorMessage)
    } finally {
      setIsShuffle(false)
    }
  }

  const handleDistributePlayers = async () => {
    setIsShuffle(true)

    if (isSharedView) {
      await distributeTeamsFromSharedLink()
    } else {
      await distributeTeamsLocally()
    }
  }

  useEffect(() => {
    if (!isFirstRenderRef.current && activeTab === TabMenu.TeamDistribution) {
      handleDistributePlayers()
      isFirstRenderRef.current = true
    } else {
      isFirstRenderRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  return {
    contextHolder,
    isSharedView,
    isShuffle,
    handleDistributePlayers
  }
}
