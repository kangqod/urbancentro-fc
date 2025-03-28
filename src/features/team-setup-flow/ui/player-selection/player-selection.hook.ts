import { useEffect, useState, useMemo } from 'react'
import { Form } from 'antd'
import { PlayerClass } from '@/entities'
import type { PositionType } from '@/entities'
import { getSelectionStatus, usePlayerSelectionState, useRequiredPlayersValue, useSetActiveTabState } from '../../lib'

import playerData from '../../model/data.json'

export function usePlayerSelection() {
  const requiredPlayers = useRequiredPlayersValue()
  const setActiveTab = useSetActiveTabState()
  const { players, availablePlayerCount, setPlayers, togglePlayerAvailability } = usePlayerSelectionState()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form] = Form.useForm()

  const isDisabled = availablePlayerCount !== requiredPlayers

  const status = useMemo(() => getSelectionStatus(availablePlayerCount, requiredPlayers), [availablePlayerCount, requiredPlayers])

  const handleModalOpen = (value: boolean) => () => {
    setIsModalOpen(value)
  }

  const handlePlayerClick = (id: string) => () => {
    togglePlayerAvailability(id)
  }

  const handlePrevClick = () => {
    setActiveTab('team-setup')
  }

  const handleNextClick = () => {
    setActiveTab('team-distribution')
  }

  useEffect(() => {
    const transformedPlayers = playerData.map((player) => {
      return new PlayerClass({
        ...player,
        position: player.position as PositionType
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
    handleModalOpen,
    handlePlayerClick,
    handlePrevClick,
    handleNextClick
  }
}
