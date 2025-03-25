import { Layout, Typography } from 'antd'
import { Users } from 'lucide-react'
import { PRIMARY_COLOR } from '@/constants'
import './team-header.css'

const { Header } = Layout
const { Title } = Typography

const url = import.meta.env.VITE_API_URL

export default function TeamHeader() {
  return (
    <Header className="team-header" onClick={() => (window.location.href = url)}>
      <div className="team-header-content">
        <Users size={24} style={{ color: PRIMARY_COLOR }} />
        <Title level={4}>Urbancentro FC</Title>
      </div>
    </Header>
  )
}
