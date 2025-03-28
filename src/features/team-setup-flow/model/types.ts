export type TabMenuType = 'team-setup' | 'player-selection' | 'team-distribution'

export interface TeamSetupFlowState {
  activeTab: TabMenuType
  isSharedView: boolean
}

export interface TeamSetupFlowStore extends TeamSetupFlowState {
  setActiveTab: (tab: TabMenuType) => void
  setIsSharedView: (value: boolean) => void
  resetFlowState: () => void
}
