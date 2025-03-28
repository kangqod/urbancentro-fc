import { Layout, Typography } from 'antd'
import { Users } from 'lucide-react'
import { PRIMARY_COLOR } from '@/shared'

import './header.css'

const { Header: AntdHeader } = Layout
const { Title } = Typography

const url = import.meta.env.VITE_API_URL

export function Header() {
  return (
    <AntdHeader className="team-header" onClick={() => (window.location.href = url)}>
      <div className="team-header-content">
        <Users size={24} style={{ color: PRIMARY_COLOR }} />
        <Title level={4}>Urbancentro FC</Title>
      </div>
    </AntdHeader>
  )
}
