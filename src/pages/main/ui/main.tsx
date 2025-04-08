import { Layout } from 'antd'
import { Header } from '@/widgets'
import { Container } from './container'
import { Theme } from './theme'
import { KakaoLoader } from './kakao-loader'

import './main.css'

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
      <KakaoLoader />
    </Layout>
  )
}
