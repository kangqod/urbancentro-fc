import { PLAYER_TIERS } from '@/entities'

export const getTierColor = (tier: string) => {
  switch (tier) {
    case PLAYER_TIERS.ACE:
      return '#ff4d4f'
    case PLAYER_TIERS.ADVANCED:
      return '#fa8c16'
    case PLAYER_TIERS.INTERMEDIATE:
      return '#52c41a'
    case PLAYER_TIERS.BEGINNER:
      return '#1890ff'
    default:
      return '#52c41a'
  }
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
