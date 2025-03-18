import { useState, useEffect, useCallback } from 'react'
import { Card, Button, Typography, Row, Col, Spin, Badge, Tooltip, message } from 'antd'
import { RotateCw, ArrowLeft, Share2, MessageCircle, Clipboard } from 'lucide-react'
import './team-distribution.css'
import { shareKakao } from '@/utils'

const { Title, Text } = Typography

interface Player {
  id: string
  name: string
  year?: string
  number?: number
  skill?: number
}

interface Team {
  id: string
  name: string
  players: Player[]
}

interface TeamDistributionProps {
  onPrev: () => void
  selectedPlayers: Player[]
  teamCount: number
}

export default function TeamDistribution({ onPrev, selectedPlayers, teamCount }: TeamDistributionProps) {
  const [teams, setTeams] = useState<Team[]>(
    Array.from({ length: teamCount }, (_, i) => ({
      id: String(i + 1),
      name: `팀 ${String.fromCharCode(65 + i)}`,
      players: []
    }))
  )
  const [isShuffling, setIsShuffling] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const playersForDistribution = selectedPlayers.map((player) => ({
    id: player.id,
    name: player.name,
    year: player.year,
    number: player.number,
    skill: player.skill
  }))

  const shuffleTeams = useCallback(() => {
    setIsShuffling(true)
    const shuffledPlayers = [...playersForDistribution].sort(() => Math.random() - 0.5)
    const teamSize = Math.floor(shuffledPlayers.length / teamCount)

    const newTeams = Array.from({ length: teamCount }, (_, index) => {
      const start = index * teamSize
      const end = index === teamCount - 1 ? shuffledPlayers.length : (index + 1) * teamSize
      return {
        id: String(index + 1),
        name: `팀 ${String.fromCharCode(65 + index)}`,
        players: shuffledPlayers.slice(start, end)
      }
    }).sort((a, b) => a.name.localeCompare(b.name))

    setTimeout(() => {
      setTeams(newTeams)
      setIsShuffling(false)
    }, 800)
  }, [playersForDistribution, teamCount])

  useEffect(() => {
    if (playersForDistribution.length > 0) {
      shuffleTeams()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                        {player.year ? `${player.year} ` : '??'}
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
          <Button size="large" icon={<ArrowLeft size={16} />} onClick={onPrev} className="action-button prev-button" disabled={isShuffling}>
            이전
          </Button>
          <Button
            type="default"
            size="large"
            icon={<RotateCw size={16} />}
            onClick={shuffleTeams}
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
