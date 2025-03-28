import { TeamSetupFlow } from '@/features'
import { useTeamContainer } from './container.hooks'

export function Container() {
  useTeamContainer()

  return <TeamSetupFlow />
}
