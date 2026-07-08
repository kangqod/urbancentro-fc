import { useEffect } from 'react'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { PRIMARY_COLOR } from '@/shared'
import { Main } from '@/pages'
import { useThemeValue } from './lib'

const fontFamily = `'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`

export function Provider() {
  const isDarkMode = useThemeValue()

  // 테마 body 클래스는 앱 루트에서 관리해 토글 버튼 마운트 여부와 무관하게 보장한다
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    document.body.classList.toggle('light-mode', !isDarkMode)
  }, [isDarkMode])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: 6,
          fontFamily
        }
      }}
    >
      <AntdApp>
        <Main />
      </AntdApp>
    </ConfigProvider>
  )
}
