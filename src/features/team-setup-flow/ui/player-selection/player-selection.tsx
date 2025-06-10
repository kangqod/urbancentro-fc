import { Button } from 'antd'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { TabFooter, TabHeader } from '@/shared'
import { GuestButton } from './guest-button'
import { PlayerSection } from './player-section'
import { ToastMessage } from './toast-message'
import { usePlayerSelection } from './player-selection.hook'

import './player-selection.scss'

const ICON_SIZE = 16

export function PlayerSelection() {
  const { detailMode, isDisabled, handlePlayerClick, handlePrevClick, handleNextClick, handleDetailModeClick } = usePlayerSelection()

  return (
    <div className="player-selection-container">
      <TabHeader title="선수 선택" description="참여할 선수를 선택해주세요" />

      <GuestButton detailMode={detailMode} onClickDetailMode={handleDetailModeClick} />

      <PlayerSection detailMode={detailMode} onClickPlayer={handlePlayerClick} />

      <TabFooter>
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
      </TabFooter>

      <ToastMessage />
    </div>
  )
}
