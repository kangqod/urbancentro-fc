import type { KakaoWindow } from '@/types'

export const PRIMARY_COLOR = '#ff681f'

// TODO: content any type
export const shareKakao = (content: any) => {
  const kakao = (window as unknown as KakaoWindow).Kakao
  const baseUrl = window.location.origin + window.location.pathname
  const teamsParam = content.teams ? `?teams=${encodeURIComponent(JSON.stringify(content.teams))}` : ''
  const shareUrl = baseUrl + teamsParam

  kakao.Share.sendDefault({
    objectType: 'text',
    text: content.description,
    link: {
      webUrl: shareUrl,
      mobileWebUrl: shareUrl
    }
  })
}
