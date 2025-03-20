import { useState } from 'react'
import { ConfigProvider, Layout } from 'antd'
import TeamTabs from '@/components/team-tabs'
import TeamHeader from '@/components/team-header'
import { PRIMARY_COLOR } from '@/constants'
import KakaoLoader from './KakaoLoader'

import './App.css'

const { Content } = Layout

export default function App() {
  const [activeTab, setActiveTab] = useState('1')

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: 6
        }
      }}
    >
      <Layout className="min-h-screen bg-gray-50">
        <TeamHeader />
        <Content className="p-4 md:p-6 max-w-[1200px] mx-auto w-full">
          <TeamTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </Content>
      </Layout>
      <KakaoLoader />
    </ConfigProvider>
  )
}
