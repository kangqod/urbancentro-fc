import { Typography, Row, Col, Card, Checkbox, Badge } from 'antd'
import { type Player } from '@/entities'
import { PRIMARY_COLOR } from '@/shared'
import { usePlayerSection } from './player-section.hooks'

interface PlayerSectionProps {
  detailMode: boolean
  onClickPlayer: (player: Player) => () => void
}

const { Text } = Typography

export function PlayerSection({ detailMode, onClickPlayer }: PlayerSectionProps) {
  const { players } = usePlayerSection()

  return (
    <div className="players-scroll-container">
      <Row gutter={[16, 16]} className="player-row">
        {players.map((player) => {
          const selectMode = !detailMode && player.isAvailable
          return (
            <Col xs={12} sm={12} md={8} key={player.id}>
              <Card hoverable className={`player-card ${selectMode ? 'selected' : ''}`} onClick={onClickPlayer(player)}>
                <div className="player-card-content">
                  <Checkbox checked={selectMode} className={`${detailMode ? 'detail-mode' : ''}`} />
                  <div className="player-info">
                    <div className="player-name-container">
                      <Text strong>
                        {player.year.slice(-2)}&nbsp;{player.name}
                      </Text>
                      {player.isGuest && <Badge count="G" style={{ backgroundColor: PRIMARY_COLOR }} />}
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
