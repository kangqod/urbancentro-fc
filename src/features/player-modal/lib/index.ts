import { PLAYER_TIERS } from '@/entities'

export const getTierColor = (tier: string) => {
  switch (tier) {
    case PLAYER_TIERS.ACE:
      return 'gold'
    case PLAYER_TIERS.ADVANCED:
      return 'geekblue'
    case PLAYER_TIERS.INTERMEDIATE:
      return 'blue'
    case PLAYER_TIERS.BEGINNER:
      return 'gray'
    default:
      return 'default'
  }
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
