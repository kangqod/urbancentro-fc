import { Card, Button, Typography, Row, Col } from 'antd'
import { Shirt, ArrowRight } from 'lucide-react'
import { MATCH_FORMAT_CONFIG } from '@/entities'
import { TabFooter, TabHeader } from '@/shared'
import { useTeamSizeSelector } from './team-size-selector.hooks'

import './team-size-selector.scss'

const { Text } = Typography

const ICON_SIZE = {
  TEAM: 26,
  ARROW: 16
}

const TEAM_OPTION_GROUPS = Object.values(
  Object.values(MATCH_FORMAT_CONFIG).reduce<
    Record<
      number,
      {
        teamCount: number
        options: { id: string; title: string; playersPerTeam: number; totalPlayers: number }[]
      }
    >
  >((groups, config) => {
    const group = (groups[config.TEAM_COUNT] ??= { teamCount: config.TEAM_COUNT, options: [] })
    group.options.push({
      id: config.ID,
      title: config.TITLE,
      playersPerTeam: config.PLAYERS_PER_TEAM,
      totalPlayers: config.PLAYERS_PER_TEAM * config.TEAM_COUNT
    })
    return groups
  }, {})
).sort((a, b) => a.teamCount - b.teamCount)

export function TeamSizeSelector() {
  const { selectedOption, handleOptionClick, handleNextClick } = useTeamSizeSelector()

  return (
    <div className="team-setup-container">
      <TabHeader title="팀 구성 선택" description="원하는 팀 구성을 선택해주세요" />

      {TEAM_OPTION_GROUPS.map((group) => (
        <section className="team-option-group" key={group.teamCount}>
          <Text className="team-option-group-title" type="secondary">
            {group.teamCount}팀 대결
          </Text>
          <Row gutter={[16, 16]} className="team-option-row">
            {group.options.map((option) => (
              <Col xs={12} md={8} key={option.id}>
                <Card
                  hoverable
                  className={`team-option-card ${selectedOption === option.id ? 'selected' : ''}`}
                >
                  <button
                    type="button"
                    className="team-option-button"
                    onClick={handleOptionClick(option.id)}
                    aria-pressed={selectedOption === option.id}
                    aria-label={`${group.teamCount}팀, 팀당 ${option.playersPerTeam}명, 총 ${option.totalPlayers}명`}
                  >
                    <div className="team-option-content">
                      <div className="team-option-jerseys" aria-hidden="true">
                        {Array.from({ length: group.teamCount }).map((_, i) => (
                          <span key={i} className="team-jersey">
                            <Shirt size={ICON_SIZE.TEAM} />
                            <span className="team-jersey-num">{option.playersPerTeam}</span>
                          </span>
                        ))}
                      </div>
                      <Text type="secondary" className="team-option-format">
                        총 {option.totalPlayers}명
                      </Text>
                    </div>
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      ))}

      <TabFooter>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRight size={ICON_SIZE.ARROW} />}
          onClick={handleNextClick}
          disabled={!selectedOption}
          className="next-button"
        >
          다음
        </Button>
      </TabFooter>
    </div>
  )
}
