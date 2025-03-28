import { Tabs } from 'antd'
import { Users, UserPlus, Shuffle } from 'lucide-react'
import { TAB_GAP, TAB_ICON_SIZE } from '../constants'
import { TeamSizeSelector } from './team-size-selector'
import { PlayerSelection } from './player-selection'
import { TeamDistribution } from './team-distribution'

import './team-setup-flow.css'
import { useActiveTabValue } from '../lib'

export function TeamSetupFlow() {
  const activeTab = useActiveTabValue()

  const tabItems = [
    {
      key: 'team-setup',
      label: (
        <div className="tab-label">
          <Users size={TAB_ICON_SIZE} />
          <span>팀 구성</span>
        </div>
      ),
      children: <TeamSizeSelector />
    },
    {
      key: 'player-selection',
      label: (
        <div className="tab-label">
          <UserPlus size={TAB_ICON_SIZE} />
          <span>선수 선택</span>
        </div>
      ),
      children: <PlayerSelection />
    },
    {
      key: 'team-distribution',
      label: (
        <div className="tab-label">
          <Shuffle size={TAB_ICON_SIZE} />
          <span>팀 분배</span>
        </div>
      ),
      children: <TeamDistribution />
    }
  ]

  return <Tabs activeKey={activeTab} items={tabItems} className="team-setup-flow" centered size="large" tabBarGutter={TAB_GAP} />
}
