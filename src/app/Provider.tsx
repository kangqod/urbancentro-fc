import { type ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import { PRIMARY_COLOR } from '@/constants'

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: 6
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}
