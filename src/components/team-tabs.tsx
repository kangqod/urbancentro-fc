import { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { Users, UserPlus, Shuffle } from 'lucide-react'
import TeamSetup from '@/components/tabs/team-setup'
import PlayerSelection from '@/components/tabs/player-selection'
import TeamDistribution from '@/components/tabs/team-distribution'
import type { Player } from '@/types'
import './team-tabs.css'

interface TeamTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
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

  useEffect(() => {
    // URL에서 teams 파라미터 읽기
    // TODO: react-router-dom 의 useParams 로 처리
    const params = new URLSearchParams(window.location.search)
    const teamsParam = params.get('teams')

    if (teamsParam) {
      try {
        const teamsData = JSON.parse(decodeURIComponent(teamsParam))
        // teams 데이터 형식: [["A", ["박지성", "김연아"]], ["B", ["박찬호", "정찬성"]]]
        const totalPlayers = teamsData.reduce((sum: number, team: any) => sum + team[1].length, 0)

        // 팀 수와 필요한 선수 수 설정
        setTeamCount(teamsData.length)
        setRequiredPlayers(totalPlayers)

        // 선수 데이터 생성
        const players = teamsData.flatMap((team: [string, string[]], teamIndex: number) =>
          team[1].map((name: string) => ({
            id: `shared-${teamIndex}-${name}`,
            name,
            number: 0,
            year: '99',
            isGuest: true,
            selected: true
          }))
        )

        setSelectedPlayers(players)
        // 팀 분배 탭으로 이동
        setActiveTab(TAB_KEYS.TEAM_DISTRIBUTION)
      } catch (e) {
        console.error('Invalid teams parameter:', e)
      }
    }
  }, [setActiveTab])

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
