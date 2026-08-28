import { Row, Col, Card, Checkbox } from 'antd'
import { Info } from 'lucide-react'
import { type Player } from '@/entities'
import { PlayerSmallCard } from '../player-small-card'
import { usePlayerSection } from './player-section.hooks'

interface PlayerSectionProps {
  detailMode: boolean
  onClickPlayer: (player: Player) => () => void
}

export function PlayerSection({ detailMode, onClickPlayer }: PlayerSectionProps) {
  const { players } = usePlayerSection()

  return (
    <div className="players-scroll-container">
      <Row gutter={[16, 16]} className="player-row">
        {players.map((player) => {
          const selectMode = !detailMode && player.isActiveForMatch
          return (
            <Col xs={12} sm={12} md={8} key={player.id}>
              <Card hoverable className={`player-card ${selectMode ? 'selected' : ''}`} onClick={onClickPlayer(player)}>
                <div className="player-card-content">
                  <Checkbox checked={selectMode} className={`${detailMode ? 'detail-mode' : ''}`} />
                  {detailMode && <Info size={16} className="player-card-info-icon" aria-hidden="true" />}
                  <div className="player-info">
                    <div className="player-name-container">
                      <PlayerSmallCard player={player} />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
