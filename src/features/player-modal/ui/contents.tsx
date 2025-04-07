import { Grid, Descriptions, Tag, Typography } from 'antd'
import { Info, Crown, Flame, Zap, ArrowBigUp, ArrowBigRight } from 'lucide-react'
import { DEFAULT_ATTRIBUTES, DEFAULT_STRENGTH, PLAYER_CONDITIONS } from '@/entities'
import type { ConditionType, Player as PlayerType } from '@/entities'
import { capitalizeFirstLetter, getTierColor, TAG_COLOR_MAP } from '../lib'

interface PlayerProps {
  player: PlayerType
  onClose: () => void
}

const { useBreakpoint } = Grid

export function Contents({ player, onClose }: PlayerProps) {
  const screens = useBreakpoint()

  return (
    <div className="player-contents" onClick={onClose}>
      <Descriptions
        column={screens.xs ? 1 : 2}
        size="middle"
        layout="horizontal"
        styles={{ label: { fontWeight: 500 } }}
        className="player-descriptions"
      >
        <Descriptions.Item
          label={
            <div className="field-label">
              <Crown className="icon tier-icon" />
              티어
            </div>
          }
        >
          <Tag color={getTierColor(player.tier)}>{capitalizeFirstLetter(player.tier)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <div className="field-label">
              <Flame className="icon flame-icon" />
              컨디션
            </div>
          }
        >
          {getCondition(player.condition)}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <div className="field-label">
              <Zap className="icon zap-icon" />
              강점
            </div>
          }
        >
          {player.strength || DEFAULT_STRENGTH}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <div className="field-label">
              <Info className="icon attribute-icon" />
              특징
            </div>
          }
        >
          {player.attributes.length === 0 ? (
            <>{DEFAULT_ATTRIBUTES}</>
          ) : (
            <ul className="player-attributes">
              {player.attributes.map((attr, index) => (
                <li key={index}>
                  <Tag color={TAG_COLOR_MAP[index]}>{attr}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Text type="secondary" className="footer-text">
        업데이트 중이며 수정이 필요한 분은 카카오톡으로 문의 ㄱㄱ
      </Typography.Text>
    </div>
  )
}

function getCondition(condition: ConditionType) {
  switch (condition) {
    case PLAYER_CONDITIONS.HIGH:
      return <ArrowBigUp className="flame-icon" />
    default:
      return <ArrowBigRight />
  }
}
