import { useShallow } from 'zustand/react/shallow'
import { type PlayerState, usePlayerStore, useTeamStore } from '@/entities'
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

export function usePlayersValue() {
  return usePlayerStore(useShallow(({ players }) => players))
}

export function useSetPlayerSelectionState() {
  return usePlayerStore(
    useShallow(({ setPlayers, togglePlayerAvailability }) => ({
      setPlayers,
      togglePlayerAvailability
    }))
  )
}

export function useAvailablePlayerCountValue() {
  return usePlayerStore(({ availablePlayerCount }) => availablePlayerCount)
}

export function useSetSelectedPlayerState(): (player?: PlayerState['selectedPlayer']) => void {
  return usePlayerStore(useShallow(({ setSelectedPlayer }) => setSelectedPlayer))
}
