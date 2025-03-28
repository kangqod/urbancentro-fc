import { useEffect } from 'react'
import type { KakaoWindow } from '../types'

export function KakaoLoader() {
  useEffect(() => {
    const kakao = (window as unknown as KakaoWindow).Kakao
    if (!kakao) return
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JS_KEY)
    }
  }, [])

  return null
}
