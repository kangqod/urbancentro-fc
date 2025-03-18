import { useState, useEffect } from 'react'
import { Card, Button, Typography, Row, Col, Spin, Badge, Tooltip, message } from 'antd'
import { RotateCw, Share2, MessageCircle, Clipboard, Undo2 } from 'lucide-react'
import { shareKakao } from '@/utils'
import type { Player, Team } from '@/types'

import './team-distribution.css'

const { Title, Text } = Typography

interface TeamDistributionProps {
  onPrev: () => void
  selectedPlayers: Player[]
  teamCount: number
}

export default function TeamDistribution({ onPrev, selectedPlayers, teamCount }: TeamDistributionProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [playersForDistribution, setPlayersForDistribution] = useState<Player[]>([])
  const [isShuffling, setIsShuffling] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    // 선택된 선수들을 복사하여 새로운 배열 생성
    setPlayersForDistribution([...selectedPlayers])
  }, [selectedPlayers])

  useEffect(() => {
    if (playersForDistribution.length > 0) {
      distributePlayers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playersForDistribution])

  const distributePlayers = async () => {
    setIsShuffling(true)
    const newTeams2 = await new Promise<Team[]>((resolve) =>
      setTimeout(() => {
        const shuffledPlayers = [...playersForDistribution].sort(() => Math.random() - 0.5)
        const newTeams = Array.from({ length: teamCount }, (_, i) => ({
          id: String(i + 1),
          name: `팀 ${String.fromCharCode(65 + i)}`,
          players: shuffledPlayers.slice(
            i * Math.ceil(shuffledPlayers.length / teamCount),
            (i + 1) * Math.ceil(shuffledPlayers.length / teamCount)
          )
        }))
        newTeams.forEach((team) => {
          team.players.sort((a, b) => a.year.localeCompare(b.year))
        })
        resolve(newTeams)
      }, 800)
    )

    setTeams(newTeams2)
    setIsShuffling(false)
  }

  const getTeamsText = () => {
    return teams
      .map((team) => {
        const playerList = team.players.map((p) => `${p.year ? `${p.year} ` : ''}${p.name}`).join('\n')
        return `${team.name}\n${playerList}`
      })
      .join('\n\n')
  }

  const handleNativeShare = async () => {
    try {
      const shareText = getTeamsText()

      if (navigator.share) {
        await navigator.share({
          title: '팀 분배 결과',
          text: shareText
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        messageApi.success('클립보드에 복사되었습니다')
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message !== 'Share canceled') {
        messageApi.error('공유에 실패했습니다')
      }
      console.error('공유 실패:', (error as Error).message)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      const shareText = getTeamsText()
      await navigator.clipboard.writeText(shareText)
      messageApi.success('클립보드에 복사되었습니다')
    } catch (error) {
      messageApi.error('복사에 실패했습니다')
      console.error('복사 실패:', error)
    }
  }

  const handleKakaoShare = () => {
    const shareText = getTeamsText()
    shareKakao(shareText)
  }

  const handlePrevClick = () => {
    setIsShuffling(true)
    setPlayersForDistribution([]) // 선수 목록 초기화
    onPrev()
  }

  return (
    <div className="team-distribution-container">
      {contextHolder}
      <div className="header">
        <Title level={4}>팀 분배</Title>
        <Text type="secondary">랜덤으로 팀을 구성했습니다</Text>
      </div>

      {isShuffling ? (
        <div className="loading-container">
          <Spin size="large" style={{ fontSize: '48px' }} />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {teams.map((team) => (
            <Col xs={8} md={8} key={team.id}>
              <Card
                title={
                  <div className="team-header">
                    <span>{team.name}</span>
                    <Badge count={team.players.length} style={{ backgroundColor: '#ff681f' }} />
                  </div>
                }
                className="team-card"
              >
                <div className="player-list">
                  {team.players.map((player) => (
                    <div key={player.id} className="player-item">
                      <Text>
                        {player.year ? `${player.year} ` : 'G '}
                        {player.name}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="button-container">
        <div className="share-icons">
          <Tooltip title="공유하기">
            <Button type="text" icon={<Share2 size={24} />} onClick={handleNativeShare} className="share-icon-button" />
          </Tooltip>
          <Tooltip title="카카오톡 공유">
            <Button type="text" icon={<MessageCircle size={24} />} onClick={handleKakaoShare} className="share-icon-button kakao" />
          </Tooltip>
          <Tooltip title="클립보드에 복사">
            <Button type="text" icon={<Clipboard size={24} />} onClick={handleCopyToClipboard} className="share-icon-button clipboard" />
          </Tooltip>
        </div>
        <div className="button-group">
          <Button type="default" onClick={handlePrevClick} className="action-button prev-button" icon={<Undo2 size={16} />}>
            이전
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<RotateCw size={16} />}
            onClick={distributePlayers}
            disabled={isShuffling}
            className="action-button shuffle-button"
          >
            다시 섞기
          </Button>
        </div>
      </div>
    </div>
  )
}
