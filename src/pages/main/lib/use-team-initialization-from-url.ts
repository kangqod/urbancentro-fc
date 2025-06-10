import { useEffect } from 'react'
import { useSetPlayersState, useSetTeamSetupFlowState } from '../lib'
import { calculateTotalPlayers, createPlayersFromTeams, parseTeamsParam } from '../lib'
import { TabMenu, TEAMS_PARAMS, useSetTeamOptionState } from '@/features'

export function useTeamInitializationFromUrl() {
  const { setActiveTab, setIsSharedView } = useSetTeamSetupFlowState()
  const setTeamOption = useSetTeamOptionState()
  const setPlayers = useSetPlayersState()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const teamsParam = params.get(TEAMS_PARAMS)

    if (!teamsParam) return

    const teamsData = parseTeamsParam(teamsParam)

    if (teamsData.length === 0) return

    const totalPlayers = calculateTotalPlayers(teamsData)
    const players = createPlayersFromTeams(teamsData)

    setTeamOption(teamsData.length, totalPlayers)
    setPlayers(players)
    setIsSharedView(true)
    setActiveTab(TabMenu.TeamDistribution)
  }, [setTeamOption, setPlayers, setActiveTab, setIsSharedView])
}
