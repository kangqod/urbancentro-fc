import { useEffect, useState, useMemo } from 'react'
import type { MouseEvent } from 'react'
import { PlayerClass, useRosterStore } from '@/entities'
import type { Player } from '@/entities'
import {
  useAvailablePlayerCountValue,
  useSetPlayerSelectionState,
  useRequiredPlayersValue,
  useSetActiveTabState,
  useSetSelectedPlayerState
} from '../../lib'

import { TabMenu } from '../../model'

export function usePlayerSelection() {
  const availablePlayerCount = useAvailablePlayerCountValue()
  const requiredPlayers = useRequiredPlayersValue()
  const setActiveTab = useSetActiveTabState()
  const { setPlayers, togglePlayerAvailability } = useSetPlayerSelectionState()
  const updateSelectedPlayer = useSetSelectedPlayerState()
  const rosterRows = useRosterStore((state) => state.rows)

  const [detailMode, setDetailMode] = useState(false)

  const isDisabled = useMemo(() => availablePlayerCount !== requiredPlayers, [availablePlayerCount, requiredPlayers])

  const handlePlayerClick = (player: Player) => () => {
    if (!detailMode) {
      togglePlayerAvailability(player.id)
      return
    }
    updateSelectedPlayer(player)
  }

  const handlePrevClick = (event?: MouseEvent<HTMLElement>) => {
    event?.currentTarget.blur()
    setActiveTab(TabMenu.TeamSetup)
  }

  const handleNextClick = (event?: MouseEvent<HTMLElement>) => {
    event?.currentTarget.blur()
    setActiveTab(TabMenu.TeamDistribution)
  }

  const handleDetailModeClick = () => {
    setDetailMode((prev) => !prev)
  }

  useEffect(() => {
    const transformedPlayers = rosterRows.map((player) => new PlayerClass(player))
    setPlayers(transformedPlayers)
  }, [setPlayers, rosterRows])

  return {
    isDisabled,
    detailMode,
    handlePlayerClick,
    handlePrevClick,
    handleNextClick,
    handleDetailModeClick
  }
}
