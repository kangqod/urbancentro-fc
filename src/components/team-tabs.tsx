import { Tabs } from 'antd'
import { Users, UserPlus, Shuffle } from 'lucide-react'
import TeamSetup from '@/components/tabs/team-setup'
import PlayerSelection from '@/components/tabs/player-selection'
import TeamDistribution from '@/components/tabs/team-distribution'
import './team-tabs.css'
import { useState } from 'react'

interface TeamTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface Player {
  id: string
  name: string
  number: number
  year: string
  isGuest: boolean
  selected: boolean
}

const TAB_ICON_SIZE = 20
const TAB_GAP = 16

const TAB_KEYS = {
  TEAM_SETUP: '1',
  PLAYER_SELECTION: '2',
  TEAM_DISTRIBUTION: '3'
} as const

export default function TeamTabs({ activeTab, setActiveTab }: TeamTabsProps) {
  const [requiredPlayers, setRequiredPlayers] = useState(0)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [teamCount, setTeamCount] = useState(2)

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
