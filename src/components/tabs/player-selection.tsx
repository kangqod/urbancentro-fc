import { useState, useEffect, useCallback } from 'react'
import { Card, Button, Typography, Row, Col, Checkbox, Badge, Modal, Form, Input, Alert, message } from 'antd'
import { UserPlus, ArrowRight, Plus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { DEFAULT_CONDITION, DEFAULT_POSITION, DEFAULT_YEAR, PRIMARY_COLOR, TAB_KEYS } from '@/constants'
import type { Player, TabKeys, ConditionType } from '@/types'

import './player-selection.css'

import playerData from '@/assets/data.json'

const { Title, Text } = Typography

const ICON_SIZE = 16

interface PlayerSelectionProps {
  onNext: () => void
  onPrev: () => void
  requiredCount: number
  onPlayersSelected: (players: Player[]) => void
  activeTab: TabKeys
}

export default function PlayerSelection({ onNext, onPrev, requiredCount, onPlayersSelected, activeTab }: PlayerSelectionProps) {
  const [players, setPlayers] = useState<Player[]>(
    playerData.map((player) => ({
      id: `${player.year}-${player.name}-${player.number}`,
      name: player.name,
      year: player.year,
      position: player.position,
      condition: (player.condition || DEFAULT_CONDITION) as ConditionType,
      number: player.number,
      isGuest: false,
      isParticipating: player.year !== DEFAULT_YEAR // 지원자
    }))
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [selectedCount, setSelectedCount] = useState(0)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const initialSelectedCount = players.filter((player) => player.isParticipating).length
    setSelectedCount(initialSelectedCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSelectionStatus = useCallback(
    (count: number) => {
      if (count === 0) {
        return { type: 'warning', message: `${requiredCount}명의 선수를 선택해주세요` }
      } else if (count < requiredCount) {
        return { type: 'warning', message: `${requiredCount - count}명이 더 필요합니다` }
      } else if (count > requiredCount) {
        return { type: 'error', message: `${count - requiredCount}명이 초과되었습니다` }
      } else {
        return { type: 'success', message: '인원이 맞습니다' }
      }
    },
    [requiredCount]
  )

  const togglePlayerSelection = (id: string) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.map((player) => {
        if (player.id === id) {
          return { ...player, isParticipating: !player.isParticipating }
        }
        return player
      })

      const newSelectedCount = newPlayers.filter((player) => player.isParticipating).length
      setSelectedCount(newSelectedCount)

      return newPlayers
    })
  }

  const addGuest = (values: { name: string }) => {
    const newPlayer: Player = {
      id: `guest-${Date.now()}`,
      name: values.name,
      number: 0,
      year: DEFAULT_YEAR,
      position: DEFAULT_POSITION,
      isGuest: true,
      isParticipating: true
    }
    setPlayers((prevPlayers) => {
      const newPlayers = [newPlayer, ...prevPlayers]
      const updatedCount = newPlayers.filter((player) => player.isParticipating).length

      setSelectedCount(updatedCount)

      return newPlayers
    })
    setIsModalOpen(false)
    form.resetFields()
  }

  const status = getSelectionStatus(selectedCount)

  const handleNext = () => {
    const selected = players.filter((player) => player.isParticipating)
    onPlayersSelected(selected)
    onNext()
  }

  useEffect(() => {
    const newStatus = getSelectionStatus(selectedCount)
    if (activeTab === TAB_KEYS.PLAYER_SELECTION) {
      // PLAYER_SELECTION 탭일 때만
      messageApi.open({
        key: 'player-selection',
        type: newStatus.type as 'warning' | 'error' | 'success',
        content: newStatus.message
      })
    }
  }, [selectedCount, getSelectionStatus, messageApi, activeTab])

  return (
    <div className="player-selection-container">
      <div className="section-header">
        <Title level={4}>선수 선택</Title>
        <Text type="secondary">참여할 선수를 선택해주세요</Text>
      </div>

      <div className="control-panel">
        <Button type="dashed" icon={<Plus size={ICON_SIZE} />} onClick={() => setIsModalOpen(true)} className="guest-add-button">
          게스트 추가
        </Button>

        <Alert
          showIcon
          message={status.message}
          type={status.type as 'warning' | 'error' | 'success'}
          icon={status.type === 'success' ? <CheckCircle size={ICON_SIZE} /> : <AlertCircle size={ICON_SIZE} />}
          className="status-alert"
        />
      </div>

      <div className="players-scroll-container">
        <Row gutter={[16, 16]} className="player-row">
          {players.map((player) => (
            <Col xs={12} sm={12} md={8} key={player.id}>
              <Card
                hoverable
                className={`player-card ${player.isParticipating ? 'selected' : ''}`}
                onClick={() => togglePlayerSelection(player.id)}
              >
                <div className="player-card-content">
                  <Checkbox checked={player.isParticipating} />
                  <div className="player-info">
                    <div className="player-name-container">
                      <Text strong>
                        {player.year.slice(-2)}&nbsp;{player.name}
                      </Text>
                      {player.isGuest && <Badge count="G" style={{ backgroundColor: PRIMARY_COLOR }} />}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="next-button-container player-selection">
        <div className="button-group">
          <Button size="large" icon={<ArrowLeft size={ICON_SIZE} />} onClick={onPrev} className="prev-button">
            이전
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRight size={ICON_SIZE} />}
            onClick={handleNext}
            disabled={selectedCount !== requiredCount}
            className="next-button"
          >
            다음
          </Button>
        </div>
      </div>

      <Modal title="게스트 추가" width={350} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={addGuest}>
          <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력해주세요' }]}>
            <Input placeholder="게스트 이름" />
          </Form.Item>
          <Form.Item className="modal-footer">
            <Button type="primary" htmlType="submit" icon={<UserPlus size={ICON_SIZE} />} className="add-guest-button">
              추가하기
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {contextHolder}
    </div>
  )
}
