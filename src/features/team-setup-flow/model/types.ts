import { TabMenu } from './store'

export interface TeamSetupFlowState {
  activeTab: TabMenu
  isSharedView: boolean
}

export interface TeamSetupFlowStore extends TeamSetupFlowState {
  setActiveTab: (tab: TabMenu) => void
  setIsSharedView: (value: boolean) => void
  resetFlowState: () => void
}
