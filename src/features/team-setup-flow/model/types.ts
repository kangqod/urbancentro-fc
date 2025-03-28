export type TabMenuType = 'team-setup' | 'player-selection' | 'team-distribution'

export interface TeamSetupFlowState {
  activeTab: TabMenuType
}

export interface TeamSetupFlowStore extends TeamSetupFlowState {
  setActiveTab: (tab: TabMenuType) => void
  resetFlowState: () => void
}
