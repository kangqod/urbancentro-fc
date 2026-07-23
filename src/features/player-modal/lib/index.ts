import { PLAYER_TIERS } from '@/entities'

// 소비처는 전부 <Tag variant="solid" color={...}>(contents.tsx:34, team-balance-log.tsx:91-94,153)라서
// solid variant가 배경색과 무관하게 흰색 텍스트를 강제하므로 CSS 변수 배경으로 바꿔도 대비가 깨지지 않는다.
export const getTierColor = (tier: string) => {
  switch (tier) {
    case PLAYER_TIERS.ACE:
      return 'var(--ant-color-error)'
    case PLAYER_TIERS.ADVANCED:
      return 'var(--fc-accent-advanced, #fa8c16)'
    case PLAYER_TIERS.INTERMEDIATE:
      return 'var(--ant-color-success)'
    case PLAYER_TIERS.BEGINNER:
      return 'var(--fc-team-b, #1890ff)'
    default:
      return 'var(--ant-color-success)'
  }
}
