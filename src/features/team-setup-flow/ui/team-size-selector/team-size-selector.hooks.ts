import { useState } from 'react'
import { useTeamStore } from '@/entities'
import { MATCH_FORMAT_CONFIG } from '../../constants'
import { useTeamSetupFlowStore } from '../../model/store'

export function useTeamSizeSelector() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const { setActiveTab } = useTeamSetupFlowStore()
  const { setTeamOption } = useTeamStore()

  const handleOptionClick = (optionId: string) => () => {
    setSelectedOption(optionId)
    const selectedTeam = Object.values(MATCH_FORMAT_CONFIG).find((option) => option.ID === optionId)
    if (selectedTeam) {
      setTeamOption(selectedTeam.TEAM_COUNT, selectedTeam.PLAYERS_PER_TEAM)
    }
  }

  function handleNextClick() {
    setActiveTab('player-selection')
  }

  return {
    selectedOption,
    handleOptionClick,
    handleNextClick
  }
}
