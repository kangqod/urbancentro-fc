import { Player } from '@/entities'

interface TitleProps {
  player: Player
  onClose: () => void
}

export function Title({ player, onClose }: TitleProps) {
  return (
    <div className="player-modal-title" onClick={onClose}>
      <div>
        <div className="player-name">
          {player.year.slice(-2)} {player.name}
        </div>
      </div>
    </div>
  )
}
