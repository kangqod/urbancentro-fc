import { useShallow } from 'zustand/react/shallow'
import { usePlayerStore, useTeamStore } from '@/entities'
import { useTeamSetupFlowStore } from '../model/store'

export function useActiveTabValue() {
  return useTeamSetupFlowStore(useShallow(({ activeTab }) => activeTab))
}

export function useSetActiveTabState() {
  return useTeamSetupFlowStore(useShallow(({ setActiveTab }) => setActiveTab))
}

export function useSetTeamOptionState() {
  return useTeamStore(useShallow(({ setTeamOption }) => setTeamOption))
}

export function useRequiredPlayersValue() {
  return useTeamStore(useShallow(({ requiredPlayers }) => requiredPlayers))
}

export function useGetAvailablePlayersState() {
  return usePlayerStore(useShallow(({ getAvailablePlayers }) => getAvailablePlayers))
}

export function useSetPlayersState() {
  return usePlayerStore(useShallow(({ setPlayers }) => setPlayers))
}

export function useTeamsValue() {
  return useTeamStore(useShallow(({ teams }) => teams))
}

export function useTeamsState() {
  return useTeamStore(
    useShallow(({ teamCount, setTeams }) => ({
      teamCount,
      setTeams
    }))
  )
}

export function useIsSharedViewState(): [boolean, (value: boolean) => void] {
  return useTeamSetupFlowStore(useShallow(({ isSharedView, setIsSharedView }) => [isSharedView, setIsSharedView]))
}

export function useIsSharedViewValue() {
  return useTeamSetupFlowStore(useShallow(({ isSharedView }) => isSharedView))
}

export function useTeamDistributionValue() {
  return useTeamSetupFlowStore(useShallow(({ isSharedView, activeTab }) => ({ isSharedView, activeTab })))
}

export function usePlayerSelectionState() {
  return usePlayerStore(
    useShallow(({ players, availablePlayerCount, setPlayers, togglePlayerAvailability }) => ({
      players,
      availablePlayerCount,
      setPlayers,
      togglePlayerAvailability
    }))
  )
}
