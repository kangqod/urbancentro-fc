import { useState } from 'react'
import { Button, Modal } from 'antd'
import { CircleHelp, ScanText, UserCheck } from 'lucide-react'
import { DEFAULT_YEAR } from '@/entities'
import type { OcrExtraction } from '../lib/extract-player'

import './ocr-review-modal.scss'

interface OcrReviewModalProps {
  extraction: OcrExtraction | null
  onClose: () => void
}

const ICON_SIZE = 18
const HEADING_ICON_SIZE = 16

export function OcrReviewModal({ extraction, onClose }: OcrReviewModalProps) {
  // 부모가 추출마다 key로 리마운트하므로 첫 값을 고정해 둔다 — 닫힘 애니메이션 중 extraction이 null이 돼도 내용 유지.
  const [shown] = useState(extraction)
  const matches = shown?.matches ?? []
  const unmatched = shown?.unmatched ?? []

  return (
    <Modal
      title={
        <div className="ocr-review-modal__header">
          <span className="ocr-review-modal__icon" aria-hidden>
            <ScanText size={ICON_SIZE} />
          </span>
          <span className="ocr-review-modal__title">인식 결과</span>
        </div>
      }
      width={400}
      open={!!extraction}
      onCancel={onClose}
      className="ocr-review-dialog"
      footer={
        <Button type="primary" size="large" block className="ocr-review-modal__cta" onClick={onClose}>
          확인
        </Button>
      }
    >
      <div className="ocr-review-modal">
        {matches.length > 0 && (
          <section className="ocr-review-modal__section">
            <h4 className="ocr-review-modal__heading is-applied">
              <UserCheck size={HEADING_ICON_SIZE} aria-hidden />
              반영된 선수 ({matches.length}명)
            </h4>
            <ul className="ocr-review-modal__chips">
              {matches.map((match) => (
                <li key={`${match.player.name}-${match.player.year}`} className="ocr-review-modal__chip is-applied">
                  <span className="ocr-review-modal__name">
                    {match.player.year !== DEFAULT_YEAR && <span className="ocr-review-modal__year">{match.player.year.slice(-2)}</span>}
                    <span>{match.player.name}</span>
                  </span>
                  {match.kind === 'prefix' && <span className="ocr-review-modal__raw">OCR: {match.raw}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
        {unmatched.length > 0 && (
          <section className="ocr-review-modal__section">
            <h4 className="ocr-review-modal__heading is-unmatched">
              <CircleHelp size={HEADING_ICON_SIZE} aria-hidden />
              미인식
            </h4>
            <p className="ocr-review-modal__hint">명단에서 찾지 못한 이름이에요.</p>
            <ul className="ocr-review-modal__chips">
              {unmatched.map((token) => (
                <li key={token} className="ocr-review-modal__chip is-unmatched">
                  <span className="ocr-review-modal__name">{token}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Modal>
  )
}
