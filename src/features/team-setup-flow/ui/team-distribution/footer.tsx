import { Button } from 'antd'
import { RotateCw, Share2, MessageCircle, Clipboard, Undo2 } from 'lucide-react'
import { useFooter } from './footer.hooks'
import { TabFooter } from '@/shared'

interface FooterProps {
  isShuffle: boolean
  onClickShuffle: () => void
}

export function Footer({ isShuffle, onClickShuffle }: FooterProps) {
  const { contextHolder, handleNativeShare, handleCopyToClipboard, handleShareKakao, handlePrevClick } = useFooter()

  return (
    <TabFooter>
      <div className="footer-container">
        <div className="share-icons">
          <Button type="text" icon={<Share2 size={24} />} loading={isShuffle} onClick={handleNativeShare} className="share-icon-button" />
          <Button
            type="text"
            icon={<MessageCircle size={24} />}
            loading={isShuffle}
            onClick={handleShareKakao}
            className="share-icon-button kakao"
          />
          <Button
            type="text"
            icon={<Clipboard size={24} />}
            loading={isShuffle}
            onClick={handleCopyToClipboard}
            className="share-icon-button clipboard"
          />
        </div>

        <div className="button-group">
          <Button type="default" disabled={isShuffle} onClick={handlePrevClick} className="prev-button" icon={<Undo2 size={16} />}>
            이전
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<RotateCw size={16} />}
            onClick={onClickShuffle}
            loading={isShuffle}
            className="shuffle-button"
          >
            다시 섞기
          </Button>
        </div>
      </div>
      {contextHolder}
    </TabFooter>
  )
}
