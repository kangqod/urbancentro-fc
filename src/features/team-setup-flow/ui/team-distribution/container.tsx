import { Card, Typography, Row, Col, Spin, Badge } from 'antd'
import { ArrowBigUp } from 'lucide-react'
import { DEFAULT_YEAR, PLAYER_CONDITIONS } from '@/entities'
import { useSetSelectedPlayerState } from '@/pages'
import { useTeamsValue } from '../../lib'

interface ContainerProps {
  isShuffle: boolean
}

const { Text } = Typography

export function Container({ isShuffle }: ContainerProps) {
  const teams = useTeamsValue()
  const updateSelectedPlayer = useSetSelectedPlayerState()

  return (
    <>
      {isShuffle ? (
        <div className="loading-container">
          <Spin size="large" style={{ fontSize: '48px' }} />
        </div>
      ) : (
        <Row gutter={[8, 8]} className="team-row">
          {teams.map((team) => (
            <Col xs={8} md={8} key={team.name}>
              <Card
                title={
                  <div className="team-header">
                    <span>{team.name}</span>
                    <Badge count={team.players.length} />
                  </div>
                }
                className="team-card"
              >
                <div className="player-list">
                  {team.players.map((player) => (
                    <div
                      key={player.id}
                      className="player-item"
                      onClick={() => {
                        if (player.isGuest) return
                        if (player.year === DEFAULT_YEAR) return
                        updateSelectedPlayer(player)
                      }}
                    >
                      <Text>
                        {player.year ? `${player.year.slice(-2)} ` : 'G '}
                        {player.name}
                      </Text>
                      {player.condition === PLAYER_CONDITIONS.HIGH && <ArrowBigUp className="arrow-big-up" />}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
