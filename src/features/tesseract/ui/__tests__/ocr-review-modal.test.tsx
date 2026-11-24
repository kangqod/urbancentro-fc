import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/shared/test/render'
import type { OcrExtraction } from '../../lib/extract-player'
import { OcrReviewModal } from '../ocr-review-modal'

const EXTRACTION: OcrExtraction = {
  matches: [
    { player: { name: '박치환', year: '1990' }, kind: 'alias', raw: '박지환' },
    { player: { name: '이원식', year: '1989' }, kind: 'exact', raw: '이원식' },
    { player: { name: '홍길동', year: '1992' }, kind: 'prefix', raw: '홍길순' }
  ],
  unmatched: ['김민중']
}

describe('OcrReviewModal', () => {
  it('반영된 선수와 미인식 이름을 보여주고, 추정 매칭엔 OCR 원문을 붙인다', () => {
    renderWithProviders(<OcrReviewModal extraction={EXTRACTION} onClose={() => {}} />)

    expect(screen.getByText('반영된 선수 (3명)')).toBeInTheDocument()
    expect(screen.getByText('박치환')).toBeInTheDocument()
    expect(screen.getByText('이원식')).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('OCR: 홍길순')).toBeInTheDocument()
    expect(screen.getByText('90')).toHaveClass('ocr-review-modal__year')
    expect(screen.queryByText('OCR: 박지환')).not.toBeInTheDocument()
    expect(screen.getByText('미인식')).toBeInTheDocument()
    expect(screen.getByText('김민중')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('확인 버튼 하나로 닫는다', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderWithProviders(<OcrReviewModal extraction={EXTRACTION} onClose={onClose} />)

    const buttons = screen.getAllByRole('button').filter((b) => b.textContent?.trim())
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['확인'])
    await user.click(screen.getByRole('button', { name: '확인' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('빈 섹션은 숨긴다', () => {
    renderWithProviders(<OcrReviewModal extraction={{ matches: [], unmatched: ['김민중'] }} onClose={() => {}} />)

    expect(screen.queryByText(/반영된 선수/)).not.toBeInTheDocument()
    expect(screen.getByText('미인식')).toBeInTheDocument()
  })
})
