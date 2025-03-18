import type { KakaoWindow } from '@/types'

export const PRIMARY_COLOR = '#ff681f'

export const shareKakao = (content: string) => {
  const kakao = (window as unknown as KakaoWindow).Kakao

  kakao.Share.sendCustom({
    objectType: 'text',
    text: content,
    link: {
      // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
      mobileWebUrl: window.location.href,
      webUrl: window.location.href
    }
  })
}
