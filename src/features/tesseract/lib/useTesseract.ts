import { useRef, useState } from 'react'
import { message } from 'antd'
import { createWorker } from 'tesseract.js'
import { extractMatchedPlayersUnified } from './extract-player'
import { useSetPlayerState } from './use-store'

const ICON_SIZE = 16

export type OcrPhase = 'prepare' | 'language' | 'recognize'

// tesseract.js v7 로거가 방출하는 status를 실행 순서대로 나열하고 가중치를 준다.
// 진행률 바는 "단계 내 진행률"이 아니라 전체 파이프라인 기준 누적 진행률(0~1)로 표시한다.
//  → 단계가 바뀔 때 100%→0%로 역주행하지 않는다.
// 여기 없는 status(예: 'initialized api' 같은 완료 이벤트, progress=1)는 무시한다.
//  → 그대로 두면 매핑 안 된 완료 이벤트가 마지막 단계 100%로 튀어, "100%에서 내려왔다 다시 오르는" 버그가 난다.
const STAGES: { status: string; phase: OcrPhase; weight: number }[] = [
  { status: 'loading tesseract core', phase: 'prepare', weight: 1 },
  { status: 'initializing tesseract', phase: 'prepare', weight: 1 },
  { status: 'loading language traineddata', phase: 'language', weight: 3 },
  { status: 'initializing api', phase: 'language', weight: 1 },
  { status: 'recognizing text', phase: 'recognize', weight: 6 }
]
const TOTAL_WEIGHT = STAGES.reduce((sum, stage) => sum + stage.weight, 0)

// status → { 단계 인덱스, phase, 전체 누적 진행률(0~1) }. 매핑되지 않는 status는 null(무시).
function resolveProgress(status: string, rawProgress: number): { index: number; phase: OcrPhase; progress: number } | null {
  let before = 0
  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i]
    // 'loading language traineddata (from cache)' 같은 접미어 변형도 매칭
    if (status === stage.status || status.startsWith(stage.status)) {
      const clamped = Math.min(1, Math.max(0, rawProgress))
      return { index: i, phase: stage.phase, progress: (before + clamped * stage.weight) / TOTAL_WEIGHT }
    }
    before += stage.weight
  }
  return null
}

export function useTesseract() {
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<OcrPhase>('prepare')
  const [progress, setProgress] = useState(0)
  // 바(누적 진행률)와 점(단계)이 로거의 간헐적 역행/미매핑 이벤트에도 뒤로 가지 않도록 단조 증가로 고정
  const progressRef = useRef(0)
  const stageIndexRef = useRef(0)
  const [messageApi, contextHolder] = message.useMessage()
  const updatePlayers = useSetPlayerState()

  const runOCR = async (file: File) => {
    let worker: Tesseract.Worker | undefined
    let image: string | undefined
    setLoading(true)
    setPhase('prepare')
    setProgress(0)
    progressRef.current = 0
    stageIndexRef.current = 0
    try {
      worker = await createWorker('kor', 1, {
        logger: m => {
          const resolved = resolveProgress(m.status, m.progress)
          if (!resolved) return
          stageIndexRef.current = Math.max(stageIndexRef.current, resolved.index)
          progressRef.current = Math.max(progressRef.current, resolved.progress)
          setPhase(STAGES[stageIndexRef.current].phase)
          setProgress(progressRef.current)
        }
      })
      image = URL.createObjectURL(file)
      const ret = await worker.recognize(image)
      const rawText = ret.data.text
      console.log('OCR raw:', rawText)
      const result = extractMatchedPlayersUnified(rawText)

      if (result.length === 0) {
        messageApi.open({
          key: 'ocr',
          type: 'error',
          style: {
            marginTop: '50px'
          },
          content: '선수 정보를 찾을 수 없습니다.'
        })
        return
      }

      console.log('OCR 결과 :', result)
      updatePlayers(result)
      messageApi.open({
        key: 'ocr',
        type: 'success',
        style: {
          marginTop: '50px'
        },
        content: `${result.length} 명의 선수가 반영되었습니다.`
      })
    } catch (error) {
      messageApi.open({
        key: 'ocr',
        type: 'error',
        style: {
          marginTop: '50px'
        },
        content: `OCR 처리 중 오류 발생하였습니다.`
      })
    } finally {
      if (worker) await worker.terminate()
      if (image) URL.revokeObjectURL(image)
      setLoading(false)
      // 오버레이는 loading=false면 언마운트되어 stale 값이 보이진 않지만,
      // 다음 실행 전 상태를 명시적으로 되돌려 teardown 의도를 분명히 한다.
      setPhase('prepare')
      setProgress(0)
      progressRef.current = 0
      stageIndexRef.current = 0
    }
  }

  const beforeUpload = (file: File) => {
    runOCR(file)
    // 업로드는 실제로 하지 않음
    return false
  }

  return {
    loading,
    phase,
    progress,
    contextHolder,
    iconSize: ICON_SIZE,
    beforeUpload
  }
}
