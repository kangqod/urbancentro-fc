import { usePlayersValue } from '../../lib'

export function usePlayerSection() {
  const players = usePlayersValue()

  return { players }
}
