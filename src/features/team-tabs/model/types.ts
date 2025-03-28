export type TabKeys = 'team-setup' | 'player-selection' | 'team-distribution'

export interface TeamTabsState {
  activeTab: TabKeys
}

export interface TeamTabsStore extends TeamTabsState {
  setActiveTab: (tab: TabKeys) => void
  resetTabsState: () => void
}
