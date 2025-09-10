import { type Player, PLAYER_CONDITIONS } from '@/entities'
import { PlayerSmallCard } from '../player-small-card'
import { Wavy } from './wavy'

interface PlayerCardProps {
  player: Player
  isBestPlayer: boolean
}

export function PlayerCard({ player, isBestPlayer }: PlayerCardProps) {
  if (isBestPlayer || player.condition === PLAYER_CONDITIONS.HIGH) {
    return (
      <div className="card-container">
        <div className="card" />
        <PlayerSmallCard player={player} />

        <Wavy />
      </div>
    )
  }

  return <PlayerSmallCard player={player} />
}
