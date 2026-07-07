import { DEFAULT_YEAR, Player } from '@/entities'

interface TitleProps {
  player: Player
  onClose: () => void
}

export function Title({ player, onClose }: TitleProps) {
  const displayYear = player.year && player.year !== DEFAULT_YEAR ? player.year.slice(-2) : ''

  return (
    <div className="player-modal-title" onClick={onClose}>
      <div>
        <div className="player-name">
          {displayYear && `${displayYear} `}
          {player.name}
        </div>
      </div>
    </div>
  )
}
