import { Badge, Typography } from 'antd'
import type { Player } from '@/entities'
import { PRIMARY_COLOR } from '@/shared'

const { Text } = Typography

const SUPPORT_NAMES = ['지원 1', '지원 2']

export function PlayerSmallCard({ player }: { player: Player }) {
  if (player.isGuest) {
    return (
      <>
        <Text strong>{player.name}</Text>&nbsp;&nbsp;&nbsp;
        <Badge count="G" style={{ backgroundColor: PRIMARY_COLOR }} />
      </>
    )
  }

  if (!player.isGuest && SUPPORT_NAMES.includes(player.name)) {
    return (
      <>
        <Text strong>{player.name}</Text>&nbsp;&nbsp;&nbsp;
        <Badge count="S" style={{ backgroundColor: PRIMARY_COLOR }} />
      </>
    )
  }

  return (
    <Text strong>
      {player.year.slice(-2)}&nbsp;{player.name}
    </Text>
  )
}
