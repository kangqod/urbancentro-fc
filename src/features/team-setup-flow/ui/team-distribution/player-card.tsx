import { type Player } from '@/entities'
import { PlayerSmallCard } from '../player-small-card'

interface PlayerCardProps {
  player: Player
  special: boolean
}

export function PlayerCard({ player, special }: PlayerCardProps) {
  return (
    <>
      {special && (
        <>
          <span className="fx-shine" aria-hidden="true" />
          <span className="fx-sparks" aria-hidden="true">
            <span className="fx-spark" />
            <span className="fx-spark" />
            <span className="fx-spark" />
            <span className="fx-spark" />
          </span>
        </>
      )}
      <PlayerSmallCard player={player} />
    </>
  )
}
