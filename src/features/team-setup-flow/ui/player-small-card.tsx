import { Typography } from 'antd'
import type { Player } from '@/entities'

import './player-small-card.scss'

const { Text } = Typography

const SUPPORT_NAMES = ['지원 1', '지원 2']

// 좁은 1/3 폭(375px 3팀)에서 한 줄 유지되도록 이름 길이로 폰트 축소 클래스를 고른다.
function lengthClass(name: string) {
  if (name.length >= 5) return 'is-len5'
  if (name.length === 4) return 'is-len4'
  return ''
}

export function PlayerSmallCard({ player }: { player: Player }) {
  if (player.isGuest) {
    return (
      <span className={`pl-line ${lengthClass(player.name)}`}>
        <span className="pl-mark-guest">게</span>
        <Text strong className="pl-name">
          {player.name}
        </Text>
      </span>
    )
  }

  if (!player.isGuest && SUPPORT_NAMES.includes(player.name)) {
    return (
      // 지원 슬롯은 이름이 '지원 1/2'로 고정 → 공백 때문에 불필요하게 축소되지 않도록 길이 클래스 제외.
      <span className="pl-line">
        <span className="pl-mark-support" role="img" aria-label="지원">
          🔄
        </span>
        <Text strong className="pl-name">
          {player.name}
        </Text>
      </span>
    )
  }

  return (
    <span className={`pl-line ${lengthClass(player.name)}`}>
      <Text type="secondary" className="pl-year">
        {player.year.slice(-2)}
      </Text>
      <Text strong className="pl-name">
        {player.name}
      </Text>
    </span>
  )
}
