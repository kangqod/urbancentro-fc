import type { KakaoWindow } from '@/types'

interface ShareContent {
  title: string
  description: string
  imageUrl?: string
}

export const shareKakao = (content: ShareContent) => {
  const kakao = (window as unknown as KakaoWindow).Kakao
  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl || 'https://urbancentro-fc.vercel.app/soccer-ball.svg',
      link: {
        webUrl: window.location.href,
        mobileWebUrl: window.location.href
      }
    },
    buttons: [
      {
        title: '결과 보기',
        link: {
          webUrl: window.location.href,
          mobileWebUrl: window.location.href
        }
      }
    ]
  })
}
