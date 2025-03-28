import { useState, useEffect } from 'react'
import { Card, Button, Typography, Row, Col, Spin, Badge, Tooltip, message } from 'antd'
import { RotateCw, Share2, MessageCircle, Clipboard, Undo2, ArrowBigUp } from 'lucide-react'
import { DEFAULT_CONDITION, PLAYER_CONDITIONS, PLAYER_POSITIONS } from '@/constants'
import { shareKakao, balanceTeams } from '@/utils'
import type { Player, Team, MatchFormatType } from '@/types'

import './team-distribution.css'

const { Title, Text } = Typography

interface TeamDistributionProps {
  onPrev: () => void
  selectedPlayers: Player[]
  teamCount: number
}

export function TeamDistribution({ onPrev, selectedPlayers, teamCount }: TeamDistributionProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [playersForDistribution, setPlayersForDistribution] = useState<Player[]>([])
  const [isShuffling, setIsShuffling] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    // URL에서 teams 파라미터 확인
    const searchParams = new URLSearchParams(window.location.search)
    setIsSharedView(searchParams.has('teams'))
  }, [])

  useEffect(() => {
    // 선택된 선수들을 복사하여 새로운 배열 생성
    setPlayersForDistribution([...selectedPlayers])
  }, [selectedPlayers])

  useEffect(() => {
    if (playersForDistribution.length > 0 || isSharedView) {
      distributePlayers(isSharedView)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playersForDistribution, isSharedView])

  const distributePlayers = async (isShared: boolean) => {
    try {
      setIsShuffling(true)

      if (isShared) {
        const searchParams = new URLSearchParams(window.location.search)
        const teamsParam = searchParams.get('teams')
        if (teamsParam) {
          try {
            const decodedTeams = JSON.parse(teamsParam)
            const formattedTeams: Team[] = decodedTeams.map((team: [string, string[]], index: number) => ({
              id: String(index + 1),
              name: `팀 ${team[0]}`,
              players: team[1].map((player, playerIndex) => {
                const [year, name, condition] = player.split('-')
                return {
                  id: `shared-${index}-${playerIndex}`,
                  name,
                  year,
                  position: PLAYER_POSITIONS.MIDFIELDER,
                  condition: condition || DEFAULT_CONDITION,
                  isGuest: true
                }
              })
            }))
            setTeams(formattedTeams)
            return
          } catch (error) {
            messageApi.error('팀 데이터를 불러오는데 실패했습니다')
            return
          }
        }
      }

      const newTeams = await new Promise<Team[]>((resolve, reject) =>
        setTimeout(() => {
          try {
            const playersPerTeam = Math.ceil(playersForDistribution.length / teamCount)
            const mode = Array(teamCount).fill(playersPerTeam).join(':') as MatchFormatType
            const balancedTeams = balanceTeams(playersForDistribution, mode)
            resolve(balancedTeams)
          } catch (error) {
            reject(error)
          }
        }, 800)
      )

      setTeams(newTeams)
    } catch (err) {
      messageApi.error((err as Error).message)
    } finally {
      setIsShuffling(false)
    }
  }

  const getTeamsText = () => {
    return teams
      .map((team) => {
        const playerList = team.players
          .map((p) => `${p.year ? `${p.year.slice(-2)}` : '99'} ${p.name} ${p.condition === PLAYER_CONDITIONS.HIGH ? '↑' : ''}`)
          .join('\n')
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

  const handleShareKakao = () => {
    const teamsData = teams.map((team) => [
      team.name.slice(-1), // "팀 A" -> "A"
      team.players.map(
        (player) =>
          `${player.year ? `${player.year.slice(-2)}` : '99'}-${player.name}-${
            player.condition === PLAYER_CONDITIONS.HIGH ? PLAYER_CONDITIONS.HIGH : ''
          }`
      )
    ])

    shareKakao({
      description: getTeamsText(),
      teams: teamsData as unknown as Team[]
    })
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
        <Row gutter={[8, 8]} className="team-row">
          {teams.map((team) => (
            <Col xs={8} md={8} key={team.id}>
              <Card
                title={
                  <div className="team-header">
                    <span>{team.name}</span>
                    <Badge count={team.players.length} />
                  </div>
                }
                className="team-card"
              >
                <div className="player-list">
                  {team.players.map((player) => (
                    <div key={player.id} className="player-item">
                      <Text>
                        {player.year ? `${player.year.slice(-2)} ` : 'G '}
                        {player.name}
                      </Text>
                      {player.condition === PLAYER_CONDITIONS.HIGH && <ArrowBigUp className="arrow-big-up" />}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!isSharedView && (
        <div className="button-container">
          <div className="share-icons">
            <Tooltip title="공유하기">
              <Button type="text" icon={<Share2 size={24} />} onClick={handleNativeShare} className="share-icon-button" />
            </Tooltip>
            <Tooltip title="카카오톡 공유">
              <Button type="text" icon={<MessageCircle size={24} />} onClick={handleShareKakao} className="share-icon-button kakao" />
            </Tooltip>
            <Tooltip title="클립보드에 복사">
              <Button type="text" icon={<Clipboard size={24} />} onClick={handleCopyToClipboard} className="share-icon-button clipboard" />
            </Tooltip>
          </div>

          <div className="button-group">
            <Button type="default" onClick={handlePrevClick} className="action-button prev-button" icon={<Undo2 size={16} />}>
              이전
            </Button>
            {!isSharedView && (
              <Button
                type="primary"
                size="large"
                icon={<RotateCw size={16} />}
                onClick={() => distributePlayers(false)}
                disabled={isShuffling}
                className="action-button shuffle-button"
              >
                다시 섞기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
