import { useShallow } from 'zustand/react/shallow'
import { usePlayerStore, useTeamStore } from '@/entities'
import type { PlayerState } from '@/entities'
import { useTeamSetupFlowStore } from '@/features'

export function useSetTeamSetupFlowState() {
  return useTeamSetupFlowStore(
    useShallow(({ setActiveTab, setIsSharedView }) => ({
      setActiveTab,
      setIsSharedView
    }))
  )
}

export function useSetTeamOptionState() {
  return useTeamStore(useShallow(({ setTeamOption }) => setTeamOption))
}

export function useSetPlayersState() {
  return usePlayerStore(useShallow(({ setPlayers }) => setPlayers))
}

export function useSelectedPlayerValue() {
  return usePlayerStore(useShallow(({ selectedPlayer }) => selectedPlayer))
}

export function useSetSelectedPlayerState(): (player?: PlayerState['selectedPlayer']) => void {
  return usePlayerStore(useShallow(({ setSelectedPlayer }) => setSelectedPlayer))
}
