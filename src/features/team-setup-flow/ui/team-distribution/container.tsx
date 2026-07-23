import { Card, Row, Col, Spin } from 'antd'
import { PREMIUM_PLAYERS, PLAYER_CONDITIONS, getTopDogTeamNames } from '@/entities'
import { teamNameToNumber } from '@/shared'
// 티어 노치·범례 비활성화로 미사용. 재활성화 시 아래 import와 PLAYER_TIERS·TIER_LABELS(@/entities) 복구.
// import { getTierColor } from '@/features/player-modal/lib'
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
        description={
          <>
            <span className="shuffle-loading__shuffle" aria-hidden="true">
              <span className="shuffle-loading__card" />
              <span className="shuffle-loading__card" />
            </span>
            <span className="shuffle-loading__text">팀을 섞는 중…</span>
          </>
        }
      />
      <TeamBalanceLog teams={teams} topDogNames={topDogNames} />
      {/* 티어 범례 일단 비활성화 (노치와 함께). 재활성화 시 PLAYER_TIERS·TIER_LABELS·getTierColor import 복구.
      {teams.length > 0 && (
        <div className="tier-legend">
          {[PLAYER_TIERS.ACE, PLAYER_TIERS.ADVANCED, PLAYER_TIERS.INTERMEDIATE, PLAYER_TIERS.BEGINNER].map((tier) => (
            <span className="tier-legend-item" key={tier}>
              <i className="tier-legend-bar" style={{ background: getTierColor(tier) }} />
              {TIER_LABELS[tier]}
            </span>
          ))}
        </div>
      )} */}
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
                  <span
                    className={`team-card-role ${topDogNames.has(team.name) ? 'is-top' : 'is-under'}`}
                    aria-label={topDogNames.has(team.name) ? '탑독' : '언더독'}
                  >
                    <span className="role-emoji" aria-hidden="true">
                      {topDogNames.has(team.name) ? '▲' : '▼'}
                    </span>
                    <span className="role-label">{topDogNames.has(team.name) ? '탑독' : '언더독'}</span>
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
                      {/* 티어 노치 일단 비활성화 (SCSS .tier-notch 규칙은 그대로 두어 재활성화 시 주석만 해제) */}
                      {/* <span className="tier-notch" style={{ background: getTierColor(player.tier) }} aria-hidden="true" /> */}
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
