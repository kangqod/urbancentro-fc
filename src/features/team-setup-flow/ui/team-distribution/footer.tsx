import { Button, Tooltip } from 'antd'
import { RotateCw, Share2, MessageCircle, Clipboard, Undo2 } from 'lucide-react'
import { useFooter } from './footer.hooks'

interface FooterProps {
  isShuffle: boolean
  onClickShuffle: () => void
}

export function Footer({ isShuffle, onClickShuffle }: FooterProps) {
  const { contextHolder, handleNativeShare, handleCopyToClipboard, handleShareKakao, handlePrevClick } = useFooter()

  return (
    <div className="button-container">
      {contextHolder}

      <div className="share-icons">
        <Tooltip title="공유하기">
          <Button type="text" icon={<Share2 size={24} />} loading={isShuffle} onClick={handleNativeShare} className="share-icon-button" />
        </Tooltip>
        <Tooltip title="카카오톡 공유">
          <Button
            type="text"
            icon={<MessageCircle size={24} />}
            loading={isShuffle}
            onClick={handleShareKakao}
            className="share-icon-button kakao"
          />
        </Tooltip>
        <Tooltip title="클립보드에 복사">
          <Button
            type="text"
            icon={<Clipboard size={24} />}
            loading={isShuffle}
            onClick={handleCopyToClipboard}
            className="share-icon-button clipboard"
          />
        </Tooltip>
      </div>

      <div className="button-group">
        <Button
          type="default"
          disabled={isShuffle}
          onClick={handlePrevClick}
          className="action-button prev-button"
          icon={<Undo2 size={16} />}
        >
          이전
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<RotateCw size={16} />}
          onClick={onClickShuffle}
          loading={isShuffle}
          className="action-button shuffle-button"
        >
          다시 섞기
        </Button>
      </div>
    </div>
  )
}
