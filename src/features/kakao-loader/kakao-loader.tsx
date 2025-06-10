import { useEffect } from 'react'

export function KakaoLoader() {
  useEffect(() => {
    const kakao = (window as unknown as { Kakao: any }).Kakao
    if (!kakao) return
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JS_KEY)
    }
  }, [])

  return null
}
