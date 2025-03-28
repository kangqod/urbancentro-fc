import { useState, useRef } from 'react'
import { TAB_KEYS } from '@/constants'
import type { TabKeys, Player } from '@/types'
import { useTeamInitializationFromUrl } from '../hooks'

export function useTeamContainer() {
  const [activeTab, setActiveTab] = useState<TabKeys>(TAB_KEYS.TEAM_SETUP)
  const [teamCount, setTeamCount] = useState(0)
  const [requiredPlayers, setRequiredPlayers] = useState(0)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])

  const teamStateUpdaters = useRef({ setTeamCount, setRequiredPlayers, setSelectedPlayers, setActiveTab })

  useTeamInitializationFromUrl(teamStateUpdaters.current)

  return { activeTab, teamCount, requiredPlayers, selectedPlayers, teamStateUpdaters: teamStateUpdaters.current }
}
