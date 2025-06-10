import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { PRIMARY_COLOR } from '@/shared'
import { Main } from '@/pages'
import { useThemeValue } from './lib'

const fontFamily = `'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`

export function Provider() {
  const isDarkMode = useThemeValue()

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
