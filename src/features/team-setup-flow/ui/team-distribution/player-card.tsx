import { Typography } from 'antd'
import { type Player, PLAYER_CONDITIONS } from '@/entities'
import { Wavy } from './wavy'

interface PlayerCardProps {
  player: Player
  isBestPlayer: boolean
}

const { Text } = Typography

export function PlayerCard({ player, isBestPlayer }: PlayerCardProps) {
  if (isBestPlayer || player.condition === PLAYER_CONDITIONS.HIGH) {
    return (
      <div className="card-container">
        <div className="card" />
        <Player player={player} />
        <Wavy />
      </div>
    )
  }

  return <Player player={player} />
}

function Player({ player }: { player: Player }) {
  return (
    <Text>
      {player.year ? `${player.year.slice(-2)} ` : 'G '}
      {player.name}
    </Text>
  )
}
