import { useEffect } from 'react'
import { message } from 'antd'
import { getSelectionStatus, useAvailablePlayerCountValue, useRequiredPlayersValue, useActiveTabValue } from '../../lib'
import { TabMenu } from '../../model'

export function useToastMessage() {
  const [messageApi, contextHolder] = message.useMessage()

  const activeTab = useActiveTabValue()
  const requiredPlayers = useRequiredPlayersValue()
  const availablePlayerCount = useAvailablePlayerCountValue()

  useEffect(() => {
    const newStatus = getSelectionStatus(availablePlayerCount, requiredPlayers)
    if (activeTab === TabMenu.PlayerSelection) {
      // PLAYER_SELECTION 탭일 때만
      messageApi.open({
        key: TabMenu.PlayerSelection,
        type: newStatus.type as 'warning' | 'error' | 'success',
        content: newStatus.message
      })
    }
  }, [availablePlayerCount, messageApi, activeTab, requiredPlayers])

  return { contextHolder }
}
