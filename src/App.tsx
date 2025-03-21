import { ConfigProvider, Layout } from 'antd'
import TeamTabs from '@/components/team-tabs'
import TeamHeader from '@/components/team-header'
import { PRIMARY_COLOR } from '@/constants'
import KakaoLoader from './KakaoLoader'
import { useApp } from './App.hooks'

import './App.css'

const { Content } = Layout

export default function App() {
  const { activeTab, handleTabChange } = useApp()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: 6
        }
      }}
    >
      <Layout className="app-layout">
        <TeamHeader />
        <Content className="app-content">
          <TeamTabs activeTab={activeTab} onChangeTab={handleTabChange} />
        </Content>
      </Layout>
      <KakaoLoader />
    </ConfigProvider>
  )
}
