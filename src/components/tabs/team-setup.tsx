import { useState } from 'react'
import { Card, Button, Typography, Row, Col } from 'antd'
import { Users, ArrowRight } from 'lucide-react'
import './team-setup.css'
// import { PRIMARY_COLOR } from '@/utils'

const { Title, Text } = Typography

interface TeamOption {
  id: string
  title: string
  description: string
  teams: number
  playersPerTeam: number
}

interface TeamSetupProps {
  onNext: () => void
  onSelectTeamOption: (totalPlayers: number, teams: number) => void
}

const ICON_SIZE = {
  TEAM: 32,
  ARROW: 16
}

export default function TeamSetup({ onNext, onSelectTeamOption }: TeamSetupProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const teamOptions: TeamOption[] = [
    { id: '1', title: '5 vs 5', description: '총 10명', teams: 2, playersPerTeam: 5 },
    { id: '2', title: '5 vs 5 vs 5', description: '총 15명', teams: 3, playersPerTeam: 5 },
    { id: '3', title: '6 vs 6', description: '총 12명', teams: 2, playersPerTeam: 6 },
    { id: '4', title: '6 vs 6 vs 6', description: '총 18명', teams: 3, playersPerTeam: 6 },
    { id: '5', title: '7 vs 7', description: '총 14명', teams: 2, playersPerTeam: 7 },
    { id: '6', title: '7 vs 7 vs 7', description: '총 21명', teams: 3, playersPerTeam: 7 }
  ]

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    const selectedTeam = teamOptions.find((option) => option.id === optionId)
    if (selectedTeam) {
      onSelectTeamOption(selectedTeam.teams * selectedTeam.playersPerTeam, selectedTeam.teams)
    }
  }

  return (
    <div className="team-setup-container">
      <div className="team-setup-header">
        <Title level={4}>팀 구성 선택</Title>
        <Text type="secondary">원하는 팀 구성을 선택해주세요</Text>
      </div>

      <Row gutter={[16, 16]}>
        {teamOptions.map((option) => (
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
