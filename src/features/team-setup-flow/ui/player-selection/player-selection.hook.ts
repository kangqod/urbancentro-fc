import { useEffect, useState, useMemo } from 'react'
import { Form, message } from 'antd'
import { DEFAULT_YEAR, PlayerClass } from '@/entities'
import type { Player, TierType } from '@/entities'
import { useSetSelectedPlayerState } from '@/pages'
import { getSelectionStatus, usePlayerSelectionState, useRequiredPlayersValue, useSetActiveTabState } from '../../lib'

import playerData from '@/shared/assets/data.json'

export function usePlayerSelection() {
  const requiredPlayers = useRequiredPlayersValue()
  const setActiveTab = useSetActiveTabState()
  const { players, availablePlayerCount, setPlayers, togglePlayerAvailability } = usePlayerSelectionState()
  const updateSelectedPlayer = useSetSelectedPlayerState()

  const [detailMode, setDetailMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const isDisabled = availablePlayerCount !== requiredPlayers

  const status = useMemo(() => getSelectionStatus(availablePlayerCount, requiredPlayers), [availablePlayerCount, requiredPlayers])

  const handleModalOpen = (value: boolean) => () => {
    setIsModalOpen(value)
  }

  const handlePlayerClick = (player: Player) => () => {
    if (!detailMode) {
      togglePlayerAvailability(player.id)
      return
    }
    if (player.isGuest || player.year === DEFAULT_YEAR) {
      messageApi.open({ key: 'no_data', type: 'warning', content: `${player.name} 님의 데이터가 없습니다.` })
      return
    }
    updateSelectedPlayer(player)
  }

  const handlePrevClick = () => {
    setActiveTab('team-setup')
  }

  const handleNextClick = () => {
    setActiveTab('team-distribution')
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
    form,
    players,
    status,
    isDisabled,
    isModalOpen,
    detailMode,
    contextHolder,
    handleModalOpen,
    handlePlayerClick,
    handlePrevClick,
    handleNextClick,
    handleDetailModeClick
  }
}
