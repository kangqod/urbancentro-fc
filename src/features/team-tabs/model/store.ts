import { create } from 'zustand'
import type { TeamTabsStore, TabKeys } from './types'

const initialState = {
  activeTab: 'team-setup' as TabKeys
}

export const useTeamTabsStore = create<TeamTabsStore>((set) => ({
  ...initialState,
  setActiveTab: (tab: TabKeys) => set({ activeTab: tab }),
  resetTabsState: () => set(initialState)
}))
