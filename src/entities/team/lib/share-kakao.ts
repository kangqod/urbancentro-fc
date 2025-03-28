import type { ShareKakaoContent } from '@/entities'

export const shareKakao = (content: ShareKakaoContent) => {
  const kakao = (window as unknown as { Kakao: any }).Kakao
  const baseUrl = window.location.origin + window.location.pathname
  const teamsParam = content.teams ? `?teams=${JSON.stringify(content.teams)}` : ''
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
