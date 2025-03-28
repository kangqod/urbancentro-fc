import { Card, Button, Typography, Row, Col, Checkbox, Badge, Alert } from 'antd'
import { ArrowRight, Plus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { PRIMARY_COLOR } from '@/shared'
import { GuestModal } from './guest-modal'
import { ToastMessage } from './toast-message'
import { usePlayerSelection } from './player-selection.hook'

import './player-selection.css'

const { Title, Text } = Typography

const ICON_SIZE = 16

export function PlayerSelection() {
  const { form, players, status, isDisabled, isModalOpen, handleModalOpen, handlePlayerClick, handlePrevClick, handleNextClick } =
    usePlayerSelection()

  return (
    <div className="player-selection-container">
      <div className="section-header">
        <Title level={4}>선수 선택</Title>
        <Text type="secondary">참여할 선수를 선택해주세요</Text>
      </div>

      <div className="control-panel">
        <Button type="dashed" icon={<Plus size={ICON_SIZE} />} onClick={handleModalOpen(true)} className="guest-add-button">
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
              <Card hoverable className={`player-card ${player.isAvailable ? 'selected' : ''}`} onClick={handlePlayerClick(player.id)}>
                <div className="player-card-content">
                  <Checkbox checked={player.isAvailable} />
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
          <Button size="large" icon={<ArrowLeft size={ICON_SIZE} />} onClick={handlePrevClick} className="prev-button">
            이전
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRight size={ICON_SIZE} />}
            onClick={handleNextClick}
            disabled={isDisabled}
            className="next-button"
          >
            다음
          </Button>
        </div>
      </div>

      <GuestModal form={form} isModalOpen={isModalOpen} onOpenModal={handleModalOpen} />
      <ToastMessage />
    </div>
  )
}
