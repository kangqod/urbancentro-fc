import { Modal, Grid } from 'antd'
import type { Player as PlayerType } from '@/entities'
import { Title } from './title'
import { Contents } from './contents'

import './player-modal.scss'

interface PlayerModalProps {
  player: PlayerType | null
  onClose: () => void
}

const { useBreakpoint } = Grid

export function PlayerModal({ player, onClose }: PlayerModalProps) {
  const screens = useBreakpoint()

  return (
    <Modal
      open={!!player}
      onCancel={onClose}
      footer={null}
      width={screens.xs ? '90%' : 600}
      centered
      className="player-modal"
      title={<>{player && <Title player={player} onClose={onClose} />}</>}
    >
      {player && <Contents player={player} onClose={onClose} />}
    </Modal>
  )
}
