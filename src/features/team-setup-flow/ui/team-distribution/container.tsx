import { Card, Row, Col, Spin, Badge } from 'antd'
import { DEFAULT_YEAR, RAINBOW_PLAYERS, BEST_PLAYERS } from '@/entities'
import { useTeamsValue, useSetSelectedPlayerState } from '../../lib'
import { PlayerCard } from './player-card'
import { TeamBalanceLog } from './team-balance-log'

interface ContainerProps {
  isShuffle: boolean
}

export function Container({ isShuffle }: ContainerProps) {
  const teams = useTeamsValue()
  const updateSelectedPlayer = useSetSelectedPlayerState()

  const columnSpan = teams.length % 2 === 0 ? 12 : 8

  return (
    <>
      {isShuffle ? (
        <Spin size="large" fullscreen className="shuffle-loading" />
      ) : (
        <>
          <Row gutter={[8, 8]} className="team-row">
            {teams.map((team) => (
              <Col xs={columnSpan} md={columnSpan} lg={4} key={team.name}>
                <Card
                  title={
                    <div className="team-card-header">
                      <span>{team.name}</span>
                      <Badge count={team.players.length} />
                    </div>
                  }
                  className="team-card"
                >
                  <div className="player-list">
                    {team.players.map((player) => {
                      const isRainbowPlayer = RAINBOW_PLAYERS.some((p) => p.name === player.name && p.year === player.year)
                      const isBestPlayer = BEST_PLAYERS.some((p) => p.name === player.name && p.year === player.year)
                      return (
                        <div
                          key={player.id}
                          className={`player-item${isRainbowPlayer ? ' rainbow' : ''}`}
                          onClick={() => {
                            if (player.isGuest) return
                            if (player.year === DEFAULT_YEAR) return
                            updateSelectedPlayer(player)
                          }}
                        >
                          <PlayerCard player={player} isBestPlayer={isBestPlayer} />
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <TeamBalanceLog teams={teams} />
        </>
      )}
    </>
  )
}
