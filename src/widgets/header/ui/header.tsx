import { Layout, Typography } from 'antd'
import { Users } from 'lucide-react'

import './header.scss'

const { Header: AntdHeader } = Layout
const { Title } = Typography

export function Header() {
  return (
    <AntdHeader className="team-header" onClick={() => (window.location.href = '/urbancentro-fc')}>
      <div className="team-header-content">
        <Users size={24} className="icon-users" />
        <Title level={3}>Urbancentro FC</Title>
      </div>
    </AntdHeader>
  )
}
