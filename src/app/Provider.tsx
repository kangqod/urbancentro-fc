import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { PRIMARY_COLOR } from '@/shared'
import { Main } from '@/pages'
import { useThemeValue } from './lib'

export function Provider() {
  const isDarkMode = useThemeValue()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: 6
        }
      }}
    >
      <AntdApp>
        <Main />
      </AntdApp>
    </ConfigProvider>
  )
}
