import { Layout } from 'antd'
import { KakaoLoader, Theme } from '@/features'
import { Header, PlayerDetailModal } from '@/widgets'
import { Container } from './container'

import './main.scss'

const { Content } = Layout

export function Main() {
  return (
    <Layout className="app-layout">
      <div className="app-header">
        <Header />
        <Theme />
      </div>
      <Content className="app-content">
        <Container />
      </Content>
      <PlayerDetailModal />
      <KakaoLoader />
    </Layout>
  )
}
