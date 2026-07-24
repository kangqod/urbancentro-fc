import { TeamSetupFlow } from '@/features'
import { useTeamInitializationFromUrl, useBuildVersionCheck } from '../lib'

export function Container() {
  useTeamInitializationFromUrl()
  useBuildVersionCheck()

  return <TeamSetupFlow />
}
