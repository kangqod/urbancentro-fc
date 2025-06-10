import { TeamSetupFlow } from '@/features'
import { useTeamInitializationFromUrl } from '../lib'

export function Container() {
  useTeamInitializationFromUrl()

  return <TeamSetupFlow />
}
