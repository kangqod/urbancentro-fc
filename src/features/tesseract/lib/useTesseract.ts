import { useState } from 'react'
import { message } from 'antd'
import { createWorker } from 'tesseract.js'
import { extractMatchedPlayersUnified } from './extract-player'
import { useSetPlayerState } from './use-store'

const ICON_SIZE = 16

export function useTesseract() {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const updatePlayers = useSetPlayerState()

  const runOCR = async (file: File) => {
    let worker: Tesseract.Worker | undefined
    let image: string | undefined
    setLoading(true)
    try {
      worker = await createWorker('kor')
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
    }
  }

  const beforeUpload = (file: File) => {
    runOCR(file)
    // 업로드는 실제로 하지 않음
    return false
  }

  return {
    loading,
    contextHolder,
    iconSize: ICON_SIZE,
    beforeUpload
  }
}
