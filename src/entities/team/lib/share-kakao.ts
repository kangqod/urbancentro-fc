import type { ShareKakaoContent } from '@/entities'

export const shareKakao = (content: ShareKakaoContent) => {
  const kakao = (window as unknown as { Kakao: any }).Kakao
  const teamsParam = content.teams ? `teams=${JSON.stringify(content.teams)}` : ''

  kakao.Share.sendCustom({
    templateId: 119479,
    templateArgs: {
      description: content.description,
      link: teamsParam
    }
  })
}
