import { useState } from 'react'
import { MATCH_FORMAT_CONFIG } from '@/entities'
import { useSetActiveTabState, useSetTeamOptionState } from '../../lib'
import { TabMenu } from '../../model'

export function useTeamSizeSelector() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const setActiveTab = useSetActiveTabState()
  const setTeamOption = useSetTeamOptionState()

  const handleOptionClick = (optionId: string) => () => {
    setSelectedOption(optionId)
    const selectedTeam = Object.values(MATCH_FORMAT_CONFIG).find((option) => option.ID === optionId)
    if (selectedTeam) {
      setTeamOption(selectedTeam.TEAM_COUNT, selectedTeam.PLAYERS_PER_TEAM)
    }
  }

  function handlePrevClick() {
    setActiveTab(TabMenu.Security)
  }

  function handleNextClick() {
    setActiveTab(TabMenu.PlayerSelection)
  }

  return {
    selectedOption,
    handleOptionClick,
    handlePrevClick,
    handleNextClick
  }
}
