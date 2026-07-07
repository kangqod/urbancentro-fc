import { useEffect, useState, useMemo } from 'react'
import type { MouseEvent } from 'react'
import { PlayerClass } from '@/entities'
import type { Player, TierType } from '@/entities'
import {
  useAvailablePlayerCountValue,
  useSetPlayerSelectionState,
  useRequiredPlayersValue,
  useSetActiveTabState,
  useSetSelectedPlayerState
} from '../../lib'

import playerData from '@/shared/assets/data.json'
import { TabMenu } from '../../model'

export function usePlayerSelection() {
  const availablePlayerCount = useAvailablePlayerCountValue()
  const requiredPlayers = useRequiredPlayersValue()
  const setActiveTab = useSetActiveTabState()
  const { setPlayers, togglePlayerAvailability } = useSetPlayerSelectionState()
  const updateSelectedPlayer = useSetSelectedPlayerState()

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
    const transformedPlayers = playerData.map((player) => {
      return new PlayerClass({
        ...player,
        tier: player.tier as TierType
      })
    })
    setPlayers(transformedPlayers)
  }, [setPlayers])

  return {
    isDisabled,
    detailMode,
    handlePlayerClick,
    handlePrevClick,
    handleNextClick,
    handleDetailModeClick
  }
}
