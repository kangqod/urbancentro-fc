import { useCallback, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { usePlayerStore, PlayerClass, PositionType, useTeamStore } from '@/entities'
import playerData from '../../model/data.json'
import { useTeamSetupFlowStore } from '../../model/store'

export function usePlayerSelection() {
  const { players, availablePlayerCount, setPlayers, togglePlayerAvailability } = usePlayerStore()
  const { requiredPlayers } = useTeamStore()
  const { activeTab, setActiveTab } = useTeamSetupFlowStore()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const handleModalOpen = (value: boolean) => () => {
    setIsModalOpen(value)
  }

  const getSelectionStatus = useCallback(
    (count: number) => {
      if (count === 0) {
        return { type: 'warning', message: `${requiredPlayers}명의 선수를 선택해주세요` }
      } else if (count < requiredPlayers) {
        return { type: 'warning', message: `${requiredPlayers - count}명이 더 필요합니다` }
      } else if (count > requiredPlayers) {
        return { type: 'error', message: `${count - requiredPlayers}명이 초과되었습니다` }
      } else {
        return { type: 'success', message: '인원이 맞습니다' }
      }
    },
    [requiredPlayers]
  )

  const handlePlayerClick = (id: string) => () => {
    togglePlayerAvailability(id)
  }

  const addGuest = (values: { name: string }) => {
    // const newPlayer: Player = {
    //   id: `guest-${Date.now()}`,
    //   name: values.name,
    //   number: 0,
    //   year: DEFAULT_YEAR,
    //   position: DEFAULT_POSITION,
    //   isGuest: true,
    //   isAvailable: true
    // }
    // setPlayers((prevPlayers) => {
    //   const newPlayers = [newPlayer, ...prevPlayers]
    //   const updatedCount = newPlayers.filter((player) => player.isAvailable).length

    //   setSelectedCount(updatedCount)

    //   return newPlayers
    // })
    handleModalOpen(false)
    form.resetFields()
  }

  const status = getSelectionStatus(availablePlayerCount)

  const handlePrevClick = () => {
    setActiveTab('team-setup')
  }

  const handleNextClick = () => {
    // const selected = players.filter((player) => player.isAvailable)
    // updateSelectedPlayers(selected)
    // isAvailable 로 처리

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

  useEffect(() => {
    const newStatus = getSelectionStatus(availablePlayerCount)
    if (activeTab === 'player-selection') {
      // PLAYER_SELECTION 탭일 때만
      messageApi.open({
        key: 'player-selection',
        type: newStatus.type as 'warning' | 'error' | 'success',
        content: newStatus.message
      })
    }
  }, [availablePlayerCount, getSelectionStatus, messageApi, activeTab])

  return {
    form,
    players,
    status,
    requiredPlayers,
    availablePlayerCount,
    isModalOpen,
    contextHolder,
    handleModalOpen,
    addGuest,
    handlePlayerClick,
    handlePrevClick,
    handleNextClick
  }
}
