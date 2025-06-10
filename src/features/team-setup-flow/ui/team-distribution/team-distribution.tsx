import { TabHeader } from '@/shared'
import { SharedView } from './shared-view'
import { DefaultView } from './default-view'
import { useTeamDistribution } from './team-distribution.hooks'

import './team-distribution.scss'

export function TeamDistribution() {
  const { contextHolder, isSharedView, isShuffle, handleDistributePlayers } = useTeamDistribution()

  return (
    <div className={`team-distribution-container${isSharedView ? ' shared-view' : ''}`}>
      <TabHeader title="팀 분배" description="선택된 선수들을 랜덤으로 팀에 배치합니다" />

      {isSharedView ? <SharedView isShuffle={isShuffle} /> : <DefaultView isShuffle={isShuffle} onClickShuffle={handleDistributePlayers} />}

      {contextHolder}
    </div>
  )
}
