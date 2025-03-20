import { useState } from 'react'
import { Card, Button, Typography, Row, Col } from 'antd'
import { Users, ArrowRight } from 'lucide-react'
import './team-setup.css'
import { MATCH_FORMAT_CONFIG } from '@/constants'
// import { PRIMARY_COLOR } from '@/utils'

const { Title, Text } = Typography

interface TeamSetupProps {
  onNext: () => void
  onSelectTeamOption: (totalPlayers: number, teams: number) => void
}

const ICON_SIZE = {
  TEAM: 32,
  ARROW: 16
}

const TEAM_OPTIONS = Object.values(MATCH_FORMAT_CONFIG).map((config) => ({
  id: config.ID,
  title: config.TITLE,
  description: config.DESCRIPTION
}))

export default function TeamSetup({ onNext, onSelectTeamOption }: TeamSetupProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    const selectedTeam = Object.values(MATCH_FORMAT_CONFIG).find((option) => option.ID === optionId)
    if (selectedTeam) {
      onSelectTeamOption(selectedTeam.TEAMS * selectedTeam.PLAYERS_PER_TEAM, selectedTeam.TEAMS)
    }
  }

  return (
    <div className="team-setup-container">
      <div className="team-setup-header">
        <Title level={4}>팀 구성 선택</Title>
        <Text type="secondary">원하는 팀 구성을 선택해주세요</Text>
      </div>

      <Row gutter={[16, 16]}>
        {TEAM_OPTIONS.map((option) => (
          <Col xs={12} md={8} key={option.id}>
            <Card
              hoverable
              className={`team-option-card ${selectedOption === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.id)}
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
          onClick={onNext}
          disabled={!selectedOption}
          className="next-button"
        >
          다음
        </Button>
      </div>
    </div>
  )
}
