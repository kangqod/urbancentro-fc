import { useEffect, useState, useRef } from 'react'
import { message } from 'antd'
import { balanceTeams } from '@/entities'
import type { MatchFormatType, Team } from '@/entities'
import { parseSharedTeams, useTeamDistributionValue, useTeamsState, useGetAvailablePlayersState, TEAMS_PARAMS } from '../../lib'
import { TabMenu } from '../../model'

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
      const errorMessage = (error as Error)?.message || '팀 데이터를 불러오는데 실패했습니다.'
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

      const newTeams = await new Promise<Team[]>((resolve) => {
        setTimeout(() => {
          const balancedTeams = balanceTeams(availablePlayers, mode)
          resolve(balancedTeams)
        }, 800)
      })

      setTeams(newTeams)
    } catch (error) {
      const errorMessage = (error as Error)?.message || '팀 데이터를 불러오는데 실패했습니다.'
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
