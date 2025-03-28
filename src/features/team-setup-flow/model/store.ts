import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { TeamSetupFlowStore, TabMenuType } from './types'

type Mutators = [['zustand/devtools', never], ['zustand/immer', never]]

const initialState = {
  activeTab: 'team-setup' as TabMenuType,
  isSharedView: false
}

const createTeamSetupFlowSlice: StateCreator<TeamSetupFlowStore, Mutators, [], TeamSetupFlowStore> = (set) => ({
  ...initialState,
  setActiveTab: (tab: TabMenuType) => set({ activeTab: tab }),
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
