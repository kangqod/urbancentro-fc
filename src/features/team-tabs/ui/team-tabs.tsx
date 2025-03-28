import { Tabs } from 'antd'
import { Users, UserPlus, Shuffle } from 'lucide-react'
import TeamSetup from '@/components/tabs/team-setup'
import PlayerSelection from '@/components/tabs/player-selection'
import TeamDistribution from '@/components/tabs/team-distribution'
import { TAB_KEYS } from '@/constants'
import type { Player } from '@/types'
import { TAB_GAP, TAB_ICON_SIZE } from '../constants'
import { useTeamTabsStore } from '../model/store'
import { usePlayerStore } from '@/entities/player/model/store'
import { useTeamStore } from '@/entities/team/model/store'

import './team-tabs.css'

interface TeamTabsProps {
  teamCount: number
  requiredPlayers: number
  selectedPlayers: Player[]
  teamStateUpdaters: {
    setTeamCount: (count: number) => void
    setRequiredPlayers: (count: number) => void
    setSelectedPlayers: (players: Player[]) => void
  }
}

export function TeamTabs({ teamCount, requiredPlayers, selectedPlayers, teamStateUpdaters }: TeamTabsProps) {
  const { setTeamCount, setRequiredPlayers, setSelectedPlayers } = teamStateUpdaters
  const { activeTab, setActiveTab } = useTeamTabsStore()

  const tabItems = [
    {
      key: TAB_KEYS.TEAM_SETUP,
      label: (
        <div className="tab-label">
          <Users size={TAB_ICON_SIZE} />
          <span>팀 구성</span>
        </div>
      ),
      children: (
        <TeamSetup
          onNext={() => setActiveTab(TAB_KEYS.PLAYER_SELECTION)}
          onSelectTeamOption={(totalPlayers: number, teams: number) => {
            setRequiredPlayers(totalPlayers)
            setTeamCount(teams)
          }}
        />
      )
    },
    {
      key: TAB_KEYS.PLAYER_SELECTION,
      label: (
        <div className="tab-label">
          <UserPlus size={TAB_ICON_SIZE} />
          <span>선수 선택</span>
        </div>
      ),
      children: (
        <PlayerSelection
          onNext={() => setActiveTab(TAB_KEYS.TEAM_DISTRIBUTION)}
          onPrev={() => setActiveTab(TAB_KEYS.TEAM_SETUP)}
          requiredCount={requiredPlayers}
          onPlayersSelected={setSelectedPlayers}
          activeTab={activeTab}
        />
      )
    },
    {
      key: TAB_KEYS.TEAM_DISTRIBUTION,
      label: (
        <div className="tab-label">
          <Shuffle size={TAB_ICON_SIZE} />
          <span>팀 분배</span>
        </div>
      ),
      children: (
        <TeamDistribution onPrev={() => setActiveTab(TAB_KEYS.PLAYER_SELECTION)} selectedPlayers={selectedPlayers} teamCount={teamCount} />
      )
    }
  ]

  return <Tabs activeKey={activeTab} items={tabItems} className="team-tabs" centered size="large" tabBarGutter={TAB_GAP} />
}
