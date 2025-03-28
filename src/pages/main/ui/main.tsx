import { Layout } from 'antd'
import { Header } from '@/widgets'
import { Container } from './container'
import { KakaoLoader } from './kakao-loader'

import './main.css'

const { Content } = Layout

export function Main() {
  return (
    <Layout className="app-layout">
      <Header />
      <Content className="app-content">
        <Container />
      </Content>
      <KakaoLoader />
    </Layout>
  )
}
