import type { OcrPhase } from '../../lib'

import './ocr-loading.scss'

interface OcrLoadingProps {
  visible: boolean
  phase: OcrPhase
  progress: number
}

const PHASES: { key: OcrPhase; label: string }[] = [
  { key: 'prepare', label: '준비' },
  { key: 'language', label: '언어' },
  { key: 'recognize', label: '인식' }
]

export function OcrLoading({ visible, phase, progress }: OcrLoadingProps) {
  if (!visible) return null

  const activeIndex = PHASES.findIndex((p) => p.key === phase)
  const percent = Math.min(100, Math.max(0, Math.round(progress * 100)))

  return (
    <div className="ocr-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="ocr-loading__card">
        <div className="ocr-loading__ball" aria-hidden="true">
          ⚽
        </div>

        <p className="ocr-loading__title">선수 명단을 읽고 있어요</p>

        <ol className="ocr-loading__steps">
          {PHASES.map((p, index) => {
            const state = index < activeIndex ? 'is-done' : index === activeIndex ? 'is-active' : ''
            return (
              <li key={p.key} className={`ocr-loading__step ${state}`}>
                <span className="ocr-loading__dot" aria-hidden="true" />
                <span className="ocr-loading__label">{p.label}</span>
              </li>
            )
          })}
        </ol>

        <div
          className="ocr-loading__bar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${PHASES[activeIndex]?.label ?? ''} 단계 진행률`}
        >
          <div className="ocr-loading__bar-fill" style={{ width: `${percent}%` }} />
        </div>

        <span className="ocr-loading__percent">{percent}%</span>
      </div>
    </div>
  )
}
