import { Card, Row, Col, Spin } from 'antd'
import { PREMIUM_PLAYERS, PLAYER_CONDITIONS, getTopDogTeamNames } from '@/entities'
import { teamNameToNumber } from '@/shared'
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
  const topDogNames = getTopDogTeamNames(teams)

  return (
    <>
      <Spin
        size="large"
        fullscreen
        spinning={isShuffle}
        className="shuffle-loading"
        tip={
          <>
            <span className="shuffle-loading__shuffle" aria-hidden="true">
              <span className="shuffle-loading__card" />
              <span className="shuffle-loading__card" />
            </span>
            <span className="shuffle-loading__text">팀을 섞는 중…</span>
          </>
        }
      />
      <TeamBalanceLog teams={teams} />
      <Row gutter={[8, 8]} className="team-row">
        {teams.map((team) => (
          <Col xs={columnSpan} md={columnSpan} lg={4} key={team.name}>
            <Card
              title={
                <div className="team-card-header">
                  <span className="team-card-title">
                    <i className="team-card-dot" />
                    {teamNameToNumber(team.name)}&nbsp;팀
                  </span>
                  <span className={`team-card-role ${topDogNames.has(team.name) ? 'is-top' : 'is-under'}`}>
                    {topDogNames.has(team.name) ? '🔥 탑독' : '🥊 언더독'}
                  </span>
                </div>
              }
              className="team-card"
            >
              <div className="player-list">
                {team.players.map((player) => {
                  const isPremiumPlayer = PREMIUM_PLAYERS.some((p) => p.name === player.name && p.year === player.year)
                  const isHighPlayer = player.condition === PLAYER_CONDITIONS.HIGH
                  const tierClass = isPremiumPlayer ? ' premium' : isHighPlayer ? ' high' : ''
                  return (
                    <div
                      key={player.id}
                      className={`player-item${tierClass}`}
                      onClick={() => {
                        updateSelectedPlayer(player)
                      }}
                    >
                      <PlayerCard player={player} special={isPremiumPlayer || isHighPlayer} />
                    </div>
                  )
                })}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
