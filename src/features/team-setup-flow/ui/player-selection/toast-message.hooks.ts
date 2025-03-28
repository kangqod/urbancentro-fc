import { useEffect } from 'react'
import { message } from 'antd'
import { usePlayerStore, useTeamStore } from '@/entities'
import { getSelectionStatus } from '../../lib'
import { useTeamSetupFlowStore } from '../../model/store'

export function useToastMessage() {
  const [messageApi, contextHolder] = message.useMessage()
  const { requiredPlayers } = useTeamStore()
  const { availablePlayerCount } = usePlayerStore()
  const { activeTab } = useTeamSetupFlowStore()

  useEffect(() => {
    const newStatus = getSelectionStatus(availablePlayerCount, requiredPlayers)
    if (activeTab === 'player-selection') {
      // PLAYER_SELECTION 탭일 때만
      messageApi.open({
        key: 'player-selection',
        type: newStatus.type as 'warning' | 'error' | 'success',
        content: newStatus.message
      })
    }
  }, [availablePlayerCount, messageApi, activeTab, requiredPlayers])

  return { contextHolder }
}
