import { Tabs } from 'antd'
import { LockKeyhole, Users, UserPlus, Shuffle } from 'lucide-react'
import { TAB_GAP, TAB_ICON_SIZE, useActiveTabValue } from '../lib'
import { TabMenu } from '../model'
import { Security } from './security'
import { TeamSizeSelector } from './team-size-selector'
import { PlayerSelection } from './player-selection'
import { TeamDistribution } from './team-distribution'

import './team-setup-flow.scss'

export function TeamSetupFlow() {
  const activeTab = useActiveTabValue()

  const tabItems = [
    {
      key: TabMenu.Security,
      destroyOnHidden: true,
      label: (
        <div className="tab-menu">
          <LockKeyhole size={TAB_ICON_SIZE} />
          <span>코드</span>
        </div>
      ),
      children: <Security />
    },
    {
      key: TabMenu.TeamSetup,
      label: (
        <div className="tab-menu">
          <Users size={TAB_ICON_SIZE} />
          <span>팀 구성</span>
        </div>
      ),
      children: <TeamSizeSelector />
    },
    {
      key: TabMenu.PlayerSelection,
      label: (
        <div className="tab-menu">
          <UserPlus size={TAB_ICON_SIZE} />
          <span>선수 선택</span>
        </div>
      ),
      children: <PlayerSelection />
    },
    {
      key: TabMenu.TeamDistribution,
      label: (
        <div className="tab-menu">
          <Shuffle size={TAB_ICON_SIZE} />
          <span>팀 분배</span>
        </div>
      ),
      children: <TeamDistribution />
    }
  ]

  return <Tabs activeKey={activeTab} items={tabItems} className="team-setup-flow" centered size="large" tabBarGutter={TAB_GAP} />
}
