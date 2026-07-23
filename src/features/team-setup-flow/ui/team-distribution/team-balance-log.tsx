import { useState } from 'react'
import { Modal, Button, Flex } from 'antd'
import { Trophy } from 'lucide-react'
import { PLAYER_TIERS, TIER_LABELS, calculateTeamStrength, getTopDogTeamNames, type Team } from '@/entities'
import { teamNameToNumber } from '@/shared'
import { getTierColor } from '@/features/player-modal/lib'

import './team-balance-log.scss'

interface TeamLogProps {
  teams: Team[]
}

const TIER_ORDER = [PLAYER_TIERS.ACE, PLAYER_TIERS.ADVANCED, PLAYER_TIERS.INTERMEDIATE, PLAYER_TIERS.BEGINNER]

// 팀 번호 → 팀 컬러(--fc-team-*). body 클래스 미장착(FOUC) 대비 인라인 다크 폴백 포함.
const TEAM_COLORS = ['var(--fc-team-a, #ff681f)', 'var(--fc-team-b, #1890ff)', 'var(--fc-team-c, #52c41a)', 'var(--fc-team-d, #eb2f96)']

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

    // 실력 점수 계산 (밸런서와 동일한 가중치 로직 재사용 — 표시값과 실제 밸런싱이 어긋나지 않도록)
    const strength = calculateTeamStrength(team)

    return {
      team,
      tierCounts,
      guestCount,
      regularCount,
      strength,
      totalPlayers: team.players.length
    }
  })

  // 전체 통계
  const maxStrength = Math.max(...teamAnalytics.map((t) => t.strength))
  const minStrength = Math.min(...teamAnalytics.map((t) => t.strength))
  const avgStrength = teamAnalytics.reduce((sum, t) => sum + t.strength, 0) / teamAnalytics.length

  // 탑독/언더독 판정은 공용 단일 소스(getTopDogTeamNames)를 소비 — 팀 헤더와 어긋나지 않게.
  const topDogTeamNames = getTopDogTeamNames(teams)

  const gap = maxStrength - minStrength

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
        <Flex vertical onClick={handleCancel} className="tbl-body">
          {/* 히어로 요약 */}
          <div className="tbl-hero">
            <div className="tbl-hero-main">
              <span className="tbl-hero-num">{avgStrength.toFixed(1)}</span>
              <span className="tbl-hero-label">평균 실력</span>
            </div>
            <div className="tbl-hero-sub">
              <div className="tbl-hero-stat">
                <span className="tbl-hero-stat-k">실력 격차</span>
                <span className="tbl-hero-stat-v">{gap}점</span>
              </div>
              <div className="tbl-hero-stat">
                <span className="tbl-hero-stat-k">총 팀 수</span>
                <span className="tbl-hero-stat-v">{teams.length}팀</span>
              </div>
            </div>
          </div>

          {/* 팀별 상세 */}
          <div className="tbl-list">
            {teamAnalytics.map((analytics, idx) => {
              const isTopDog = topDogTeamNames.has(analytics.team.name)
              const teamNo = teamNameToNumber(analytics.team.name) ?? idx + 1
              const tc = TEAM_COLORS[(teamNo - 1) % TEAM_COLORS.length]
              const total = analytics.totalPlayers
              return (
                <div className="tbl-team" key={idx}>
                  <div className="tbl-team-head">
                    <span className="tbl-team-name">
                      <i className="tbl-team-dot" style={{ background: tc }} />
                      {teamNo}팀
                      <span className={`tbl-team-role ${isTopDog ? 'is-top' : 'is-under'}`}>{isTopDog ? '🔥 탑독' : '🥊 언더독'}</span>
                    </span>
                    <span className="tbl-team-score">
                      {analytics.strength}
                      <small>점</small>
                    </span>
                  </div>

                  <div className="tbl-bar">
                    {TIER_ORDER.map((tier) => {
                      const count = analytics.tierCounts[tier]
                      if (count === 0 || total === 0) return null
                      return <span key={tier} className="tbl-bar-seg" style={{ width: `${(count / total) * 100}%`, background: getTierColor(tier) }} />
                    })}
                  </div>

                  <div className="tbl-tierlabels">
                    {TIER_ORDER.map((tier) => {
                      const count = analytics.tierCounts[tier]
                      if (count === 0) return null
                      return (
                        <span className="tbl-tl" key={tier}>
                          <i className="tbl-tl-dot" style={{ background: getTierColor(tier) }} />
                          {TIER_LABELS[tier]} <b>{count}</b>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 밸런스 평가 */}
          <div className="tbl-verdict">
            {gap <= 2 ? (
              <span className="tbl-verdict-badge is-good">✅&nbsp;매우 균형잡힌 팀 구성</span>
            ) : gap <= 4 ? (
              <span className="tbl-verdict-badge is-warn">⚠️&nbsp;보통 수준의 밸런스</span>
            ) : (
              <span className="tbl-verdict-badge is-bad">❌&nbsp;밸런스 조정 필요</span>
            )}
          </div>
        </Flex>
      </Modal>
    </>
  )
}
