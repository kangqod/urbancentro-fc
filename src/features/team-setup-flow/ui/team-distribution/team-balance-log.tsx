import { useState } from 'react'
import { Modal, Button, Card, Row, Col, Tag, Progress, Divider, Statistic, Space, Flex } from 'antd'
import { Trophy, Users } from 'lucide-react'
import { PLAYER_TIERS, type Team } from '@/entities'
import { teamNameToNumber } from '@/shared'
import { getTierColor } from '@/features/player-modal/lib'

import './team-balance-log.scss'

interface TeamLogProps {
  teams: Team[]
}

export function TeamBalanceLog({ teams }: TeamLogProps) {
  const [visible, setVisible] = useState(false)

  // 팀별 상세 정보 계산
  const teamAnalytics = teams.map((team) => {
    const tierCounts = {
      ace: team.players.filter((p) => p.tier === PLAYER_TIERS.ACE).length,
      advanced: team.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length,
      intermediate: team.players.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE).length,
      beginner: team.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length
    }

    const guestCount = team.players.filter((p) => p.isGuest).length
    const regularCount = team.players.length - guestCount

    // 실력 점수 계산 (가중치 기반)
    const tierWeights = { ace: 4, advanced: 3, intermediate: 2, beginner: 1 }
    const strength = team.players.reduce((sum, p) => {
      return sum + (tierWeights[p.tier as keyof typeof tierWeights] || 1)
    }, 0)

    return {
      team,
      tierCounts,
      guestCount,
      regularCount,
      strength,
      totalPlayers: team.players.length
    }
  })

  console.log(teamAnalytics)

  // 전체 통계
  const maxStrength = Math.max(...teamAnalytics.map((t) => t.strength))
  const minStrength = Math.min(...teamAnalytics.map((t) => t.strength))
  const avgStrength = teamAnalytics.reduce((sum, t) => sum + t.strength, 0) / teamAnalytics.length

  function handleCancel() {
    setVisible(false)
  }

  return (
    <>
      <Button type="primary" icon={<Trophy className="icon-trophy" />} className="team-balance-log-button" onClick={() => setVisible(true)}>
        밸런스 정보
      </Button>

      <Modal
        title={
          <div className="team-balance-log-modal-header">
            <Trophy className="icon-trophy-title" />팀 밸런스 정보
          </div>
        }
        centered
        open={visible}
        footer={null}
        width={400}
        className="team-balance-log-modal"
        onCancel={handleCancel}
      >
        <Flex vertical onClick={handleCancel}>
          {/* 전체 통계 요약 */}
          <Card size="small" className="team-balance-log-total-statistics-card">
            <Row gutter={16} style={{ textAlign: 'center' }}>
              <Col span={8}>
                <Statistic title={<span className="team-balance-log-statistic-title">평균 실력</span>} value={avgStrength.toFixed(1)} />
              </Col>
              <Col span={8}>
                <Statistic title={<span className="team-balance-log-statistic-title">실력 격차</span>} value={maxStrength - minStrength} />
              </Col>
              <Col span={8}>
                <Statistic title={<span className="team-balance-log-statistic-title">총 팀 수</span>} value={teams.length} />
              </Col>
            </Row>
          </Card>

          <Divider orientation="left">팀별 상세 분석</Divider>
          {/* 티어 범례 */}
          <Flex className="team-balance-log-legend" align="center" justify="space-around">
            <Space>
              <Tag color={getTierColor(PLAYER_TIERS.ACE)}>Ace</Tag>
              <Tag color={getTierColor(PLAYER_TIERS.ADVANCED)}>Advanced</Tag>
              <Tag color={getTierColor(PLAYER_TIERS.INTERMEDIATE)}>Intermediate</Tag>
              <Tag color={getTierColor(PLAYER_TIERS.BEGINNER)}>Beginner</Tag>
            </Space>
          </Flex>

          <Row gutter={[16, 16]} justify="center">
            {teamAnalytics.map((analytics, idx) => (
              <Col span={8} key={idx}>
                <Card
                  title={
                    <>
                      <Users className="icon-users" size="20" />
                      <strong className="team-balance-log-team-name">{teamNameToNumber(analytics.team.name)}&nbsp;팀</strong>
                    </>
                  }
                  size="small"
                  className={
                    `team-balance-log-card ` +
                    (analytics.strength === maxStrength
                      ? 'team-balance-log-card--max'
                      : analytics.strength === minStrength
                      ? 'team-balance-log-card--min'
                      : '')
                  }
                >
                  {/* 밸런스 상태 표시 */}
                  <Flex className="team-balance-log-tier mt-auto" justify="center" align="center">
                    {analytics.strength === maxStrength ? (
                      <Tag color="success">최강팀</Tag>
                    ) : analytics.strength === minStrength ? (
                      <Tag color="error">약체팀</Tag>
                    ) : (
                      <Tag color="default">균형팀</Tag>
                    )}
                  </Flex>

                  {/* 실력 점수 */}
                  <Space direction="vertical" className="team-balance-log-strength-space">
                    <Flex className="team-balance-log-strength" justify="space-between" align="center" style={{ width: '100%' }}>
                      <span className="team-balance-log-strength-title">팀 점수</span>
                      <span className="team-balance-log-strength-value">{analytics.strength}점</span>
                    </Flex>
                    <Progress
                      percent={Math.round((analytics.strength / maxStrength) * 100)}
                      showInfo={false}
                      strokeColor={{
                        '0%': '#d05000',
                        '100%': '#ff9f5f'
                      }}
                    />
                  </Space>

                  {/* 티어별 구성 - 숫자만 태그로 표시 */}
                  <Flex className="team-balance-log-tier mt-8" wrap justify="space-between" gap={4}>
                    {Object.entries(analytics.tierCounts).map(
                      ([tier, count]) =>
                        count > 0 && (
                          <Tag
                            key={tier}
                            color={getTierColor(tier)}
                            style={{ margin: '2px', minWidth: 32, textAlign: 'center', fontWeight: 'bold' }}
                          >
                            {count}
                          </Tag>
                        )
                    )}
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider orientation="left">밸런스 평가</Divider>
          <Flex justify="center" align="center">
            {maxStrength - minStrength <= 2 ? (
              <Tag color="success" className="team-balance-log-tag">
                ✅&nbsp;&nbsp;매우 균형잡힌 팀 구성
              </Tag>
            ) : maxStrength - minStrength <= 4 ? (
              <Tag color="warning" className="team-balance-log-tag">
                ⚠️&nbsp;&nbsp;보통 수준의 밸런스
              </Tag>
            ) : (
              <Tag color="error" className="team-balance-log-tag">
                ❌&nbsp;&nbsp;밸런스 조정 필요
              </Tag>
            )}
          </Flex>
        </Flex>
      </Modal>
    </>
  )
}
