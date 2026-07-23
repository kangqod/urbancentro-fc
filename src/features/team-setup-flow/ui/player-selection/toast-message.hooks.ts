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
    // 선수 선택 탭을 벗어나면 남아 있던 토스트를 즉시 닫는다(분배 탭까지 잔상이 넘어가지 않도록).
    if (activeTab !== TabMenu.PlayerSelection) {
      messageApi.destroy(TabMenu.PlayerSelection)
      return
    }
    const newStatus = getSelectionStatus(availablePlayerCount, requiredPlayers)
    messageApi.open({
      key: TabMenu.PlayerSelection,
      type: newStatus.type as 'warning' | 'error' | 'success',
      content: newStatus.message
    })
  }, [availablePlayerCount, messageApi, activeTab, requiredPlayers])

  return { contextHolder }
}
