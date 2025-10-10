import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { type TeamSetupFlowStore } from './types'

type Mutators = [['zustand/devtools', never], ['zustand/immer', never]]

export enum TabMenu {
  Security = 'security',
  TeamSetup = 'team-setup',
  PlayerSelection = 'player-selection',
  TeamDistribution = 'team-distribution'
}

const initialState = {
  activeTab: TabMenu.Security,
  isSharedView: false
}

const createTeamSetupFlowSlice: StateCreator<TeamSetupFlowStore, Mutators, [], TeamSetupFlowStore> = (set) => ({
  ...initialState,
  setActiveTab: (tab: TabMenu) => set({ activeTab: tab }),
  setIsSharedView: (isSharedView: boolean) => set({ isSharedView }),
  resetFlowState: () => set(initialState)
})

export const useTeamSetupFlowStore = create<TeamSetupFlowStore>()(
  devtools(
    immer((...rest) => ({
      ...createTeamSetupFlowSlice(...rest)
    })),
    { name: 'urbancentro-fc-team-setup-flow-store', enabled: !import.meta.env.PROD }
  )
)
