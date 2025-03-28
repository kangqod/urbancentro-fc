import { useEffect } from 'react'
import { TAB_KEYS } from '@/constants'
import type { TabKeys, Player } from '@/types'
import { calculateTotalPlayers, createPlayersFromTeams, parseTeamsParam } from '../utils'

interface UseTeamParamsProps {
  setTeamCount: (count: number) => void
  setRequiredPlayers: (count: number) => void
  setSelectedPlayers: (players: Player[]) => void
  setActiveTab: (tab: TabKeys) => void
}

export function useTeamInitializationFromUrl({ setTeamCount, setRequiredPlayers, setSelectedPlayers, setActiveTab }: UseTeamParamsProps) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const teamsParam = params.get('teams')

    if (!teamsParam) return

    const teamsData = parseTeamsParam(teamsParam)
    if (teamsData.length === 0) return

    const totalPlayers = calculateTotalPlayers(teamsData)
    const players = createPlayersFromTeams(teamsData)

    setTeamCount(teamsData.length)
    setRequiredPlayers(totalPlayers)
    setSelectedPlayers(players)
    setActiveTab(TAB_KEYS.TEAM_DISTRIBUTION)
  }, [setTeamCount, setRequiredPlayers, setSelectedPlayers, setActiveTab])
}
