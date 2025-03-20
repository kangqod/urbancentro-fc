import { Layout, Typography } from 'antd'
import { Users } from 'lucide-react'
import { PRIMARY_COLOR } from '@/constants'
import './team-header.css'

const { Header } = Layout
const { Title } = Typography

export default function TeamHeader() {
  // TODO: reload 부분 수정
  return (
    <Header className="team-header" onClick={() => (window.location.href = '/urbancentro-fc')}>
      <div className="team-header-content">
        <Users size={24} style={{ color: PRIMARY_COLOR }} />
        <Title
          level={4}
          style={{
            margin: 0,
            color: '#1f2937'
          }}
        >
          Urbancentro FC
        </Title>
      </div>
    </Header>
  )
}
