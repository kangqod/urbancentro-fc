import { create } from 'zustand'
import type { TeamSetupFlowStore, TabMenuType } from './types'

const initialState = {
  activeTab: 'team-setup' as TabMenuType
}

export const useTeamSetupFlowStore = create<TeamSetupFlowStore>((set) => ({
  ...initialState,
  setActiveTab: (tab: TabMenuType) => set({ activeTab: tab }),
  resetFlowState: () => set(initialState)
}))
