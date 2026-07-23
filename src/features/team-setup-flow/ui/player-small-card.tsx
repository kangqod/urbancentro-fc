import { Badge, Typography } from 'antd'
import type { Player } from '@/entities'
import { PRIMARY_COLOR } from '@/shared'

const { Text } = Typography

const SUPPORT_NAMES = ['지원 1', '지원 2']

export function PlayerSmallCard({ player }: { player: Player }) {
  if (player.isGuest) {
    return (
      <>
        <Badge count="G" style={{ backgroundColor: PRIMARY_COLOR }} />
        &nbsp;&nbsp;&nbsp;
        <Text strong>{player.name}</Text>
      </>
    )
  }

  if (!player.isGuest && SUPPORT_NAMES.includes(player.name)) {
    return (
      <>
        <Badge count="S" style={{ backgroundColor: PRIMARY_COLOR }} />
        &nbsp;&nbsp;&nbsp;
        <Text strong>{player.name}</Text>
      </>
    )
  }

  return (
    <Text strong>
      <Text type="secondary" style={{ fontSize: '0.8em', fontWeight: 400 }}>
        {player.year.slice(-2)}
      </Text>
      &nbsp;{player.name}
    </Text>
  )
}
