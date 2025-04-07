import { Typography } from 'antd'
import { SharedView } from './shared-view'
import { DefaultView } from './default-view'
import { useTeamDistribution } from './team-distribution.hooks'
import { ReleaseDate } from './release-date'

import './team-distribution.css'

const { Title, Text } = Typography

export function TeamDistribution() {
  const { contextHolder, isSharedView, isShuffle, handleDistributePlayers } = useTeamDistribution()

  return (
    <div className="team-distribution-container">
      {contextHolder}
      <div className="header">
        <Title level={4}>팀 분배</Title>
        <Text type="secondary">랜덤으로 팀을 구성했습니다</Text>
        <ReleaseDate />
      </div>

      {isSharedView ? <SharedView isShuffle={isShuffle} /> : <DefaultView isShuffle={isShuffle} onClickShuffle={handleDistributePlayers} />}
    </div>
  )
}
