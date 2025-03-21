import { useState } from 'react'
import type { TabKeys } from './types'
import { TAB_KEYS } from './constants'

export function useApp() {
  const [activeTab, setActiveTab] = useState<TabKeys>(TAB_KEYS.TEAM_SETUP)

  function handleTabChange(tab: TabKeys) {
    setActiveTab(tab)
  }

  return {
    activeTab,
    handleTabChange
  }
}
