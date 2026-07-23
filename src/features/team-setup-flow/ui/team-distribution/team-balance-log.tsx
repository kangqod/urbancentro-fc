import { useState } from 'react'
import { Modal, Button, Card, Row, Col, Tag, Progress, Divider, Statistic, Space, Flex } from 'antd'
import { Trophy, Users } from 'lucide-react'
import { PLAYER_TIERS, TIER_LABELS, PLAYER_CONDITIONS, PREMIUM_PLAYERS, calculateTeamStrength, type Team } from '@/entities'
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
    // 티어 값(한글)을 키로 사용해 getTierColor와 매칭되도록 한다.
    const tierCounts = {
      [PLAYER_TIERS.ACE]: team.players.filter((p) => p.tier === PLAYER_TIERS.ACE).length,
      [PLAYER_TIERS.ADVANCED]: team.players.filter((p) => p.tier === PLAYER_TIERS.ADVANCED).length,
      [PLAYER_TIERS.INTERMEDIATE]: team.players.filter((p) => p.tier === PLAYER_TIERS.INTERMEDIATE).length,
      [PLAYER_TIERS.BEGINNER]: team.players.filter((p) => p.tier === PLAYER_TIERS.BEGINNER).length
    }

    const guestCount = team.players.filter((p) => p.isGuest).length
    const regularCount = team.players.length - guestCount

    const highCount = team.players.filter((p) => p.condition === PLAYER_CONDITIONS.HIGH).length
    const premiumCount = team.players.filter((p) => PREMIUM_PLAYERS.some((pp) => pp.name === p.name && pp.year === p.year)).length

    // 실력 점수 계산 (밸런서와 동일한 가중치 로직 재사용 — 표시값과 실제 밸런싱이 어긋나지 않도록)
    const strength = calculateTeamStrength(team)

    // 최강/약체 판정용 종합 화력: 점수 + HIGH 컨디션 + 프리미엄 선수 수를 가중 합산.
    const powerScore = strength + highCount * 2 + premiumCount * 3

    return {
      team,
      tierCounts,
      guestCount,
      regularCount,
      highCount,
      premiumCount,
      strength,
      powerScore,
      totalPlayers: team.players.length
    }
  })

  // 전체 통계
  const maxStrength = Math.max(...teamAnalytics.map((t) => t.strength))
  const minStrength = Math.min(...teamAnalytics.map((t) => t.strength))
  const avgStrength = teamAnalytics.reduce((sum, t) => sum + t.strength, 0) / teamAnalytics.length

  // 종합 화력 내림차순 정렬 후 상위 floor(N/2)팀을 탑독, 나머지를 언더독으로.
  // 타이브레이크: powerScore → 팀점수 → 프리미엄 → HIGH → 상위 티어 구성(에이스→상급→중급)
  // → 팀 이름. 마지막 팀 이름 비교로 완전 동점을 없애 항상 강한/약한 팀이 갈리게 한다.
  const rankedTeams = [...teamAnalytics].sort(
    (a, b) =>
      b.powerScore - a.powerScore ||
      b.strength - a.strength ||
      b.premiumCount - a.premiumCount ||
      b.highCount - a.highCount ||
      b.tierCounts[PLAYER_TIERS.ACE] - a.tierCounts[PLAYER_TIERS.ACE] ||
      b.tierCounts[PLAYER_TIERS.ADVANCED] - a.tierCounts[PLAYER_TIERS.ADVANCED] ||
      b.tierCounts[PLAYER_TIERS.INTERMEDIATE] - a.tierCounts[PLAYER_TIERS.INTERMEDIATE] ||
      a.team.name.localeCompare(b.team.name)
  )
  const topDogCount = Math.max(1, Math.floor(teamAnalytics.length / 2))
  const topDogTeamNames = new Set(rankedTeams.slice(0, topDogCount).map((t) => t.team.name))

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

          <Divider titlePlacement="start">팀별 상세 분석</Divider>
          {/* 티어 범례 */}
          <Flex className="team-balance-log-legend" align="center" justify="space-around">
            <Space>
              <Tag variant="solid" color={getTierColor(PLAYER_TIERS.ACE)}>{TIER_LABELS[PLAYER_TIERS.ACE]}</Tag>
              <Tag variant="solid" color={getTierColor(PLAYER_TIERS.ADVANCED)}>{TIER_LABELS[PLAYER_TIERS.ADVANCED]}</Tag>
              <Tag variant="solid" color={getTierColor(PLAYER_TIERS.INTERMEDIATE)}>{TIER_LABELS[PLAYER_TIERS.INTERMEDIATE]}</Tag>
              <Tag variant="solid" color={getTierColor(PLAYER_TIERS.BEGINNER)}>{TIER_LABELS[PLAYER_TIERS.BEGINNER]}</Tag>
            </Space>
          </Flex>

          <Row gutter={[16, 16]} justify="center">
            {teamAnalytics.map((analytics, idx) => {
              const isTopDog = topDogTeamNames.has(analytics.team.name)
              return (
              <Col span={8} key={idx}>
                <Card
                  title={
                    <>
                      <Users className="icon-users" size="20" />
                      <strong className="team-balance-log-team-name">{teamNameToNumber(analytics.team.name)}&nbsp;팀</strong>
                    </>
                  }
                  size="small"
                  className={`team-balance-log-card ` + (isTopDog ? 'team-balance-log-card--max' : 'team-balance-log-card--min')}
                >
                  {/* 밸런스 상태 표시 — 종합 화력 상위 절반=탑독 / 하위=언더독 */}
                  <Flex className="team-balance-log-tier mt-auto" justify="center" align="center">
                    {isTopDog ? <Tag color="success">탑독</Tag> : <Tag color="error">언더독</Tag>}
                  </Flex>

                  {/* 실력 점수 */}
                  <Space orientation="vertical" className="team-balance-log-strength-space">
                    <Flex className="team-balance-log-strength" justify="space-between" align="center" style={{ width: '100%' }}>
                      <span className="team-balance-log-strength-title">팀 점수</span>
                      <span className="team-balance-log-strength-value">{analytics.strength}점</span>
                    </Flex>
                    <Progress
                      percent={maxStrength > 0 ? Math.round((analytics.strength / maxStrength) * 100) : 0}
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
                            variant="solid"
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
              )
            })}
          </Row>

          <Divider titlePlacement="start">밸런스 평가</Divider>
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
