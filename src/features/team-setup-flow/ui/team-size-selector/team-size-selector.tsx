import { Card, Button, Typography, Row, Col } from 'antd'
import { Users, ArrowRight } from 'lucide-react'
import { MATCH_FORMAT_CONFIG } from '../../constants'
import { useTeamSizeSelector } from './team-size-selector.hooks'

import './team-size-selector.css'

const { Title, Text } = Typography

const ICON_SIZE = {
  TEAM: 32,
  ARROW: 16
}

const TEAM_OPTIONS = Object.values(MATCH_FORMAT_CONFIG).map((config) => ({
  id: config.ID,
  title: config.TITLE,
  description: config.DESCRIPTION
}))

export function TeamSizeSelector() {
  const { selectedOption, handleOptionClick, handleNextClick } = useTeamSizeSelector()

  return (
    <div className="team-setup-container">
      <div className="team-setup-header">
        <Title level={4}>팀 구성 선택</Title>
        <Text type="secondary">원하는 팀 구성을 선택해주세요</Text>
      </div>

      <Row gutter={[16, 16]} className="team-option-row">
        {TEAM_OPTIONS.map((option) => (
          <Col xs={12} md={8} key={option.id}>
            <Card
              hoverable
              className={`team-option-card ${selectedOption === option.id ? 'selected' : ''}`}
              onClick={handleOptionClick(option.id)}
            >
              <div className="team-option-content">
                <Users size={ICON_SIZE.TEAM} className={selectedOption === option.id ? 'icon-selected' : 'icon-default'} />
                <Title level={5} className="option-title">
                  {option.title}
                </Title>
                <Text type="secondary">{option.description}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="next-button-container">
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
      </div>
    </div>
  )
}
