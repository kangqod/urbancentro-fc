import { Typography } from 'antd'
import { ReleaseDate } from '../release-date/release-date'

import './tab-header.scss'

interface TabHeaderProps {
  title: string
  description: string
}

const { Title, Text } = Typography

export function TabHeader({ title, description }: TabHeaderProps) {
  return (
    <div className="tab-header">
      <Title level={4}>{title}</Title>
      <Text type="secondary">{description}</Text>
      <ReleaseDate />
    </div>
  )
}
