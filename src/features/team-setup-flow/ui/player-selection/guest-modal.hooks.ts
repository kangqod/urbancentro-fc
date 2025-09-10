import { FormInstance } from 'antd'
import {
  DEFAULT_YEAR,
  DEFAULT_NUMBER,
  DEFAULT_CONDITION,
  PlayerClass,
  DEFAULT_TIER,
  DEFAULT_STRENGTH,
  DEFAULT_ATTRIBUTES
} from '@/entities'
import type { Player } from '@/entities'
import { useSetPlayersState, usePlayersValue } from '../../lib'

interface UseGuestModalProps {
  form: FormInstance<any>
  onOpenModal: (value: boolean) => () => void
}

export function useGuestModal({ form, onOpenModal }: UseGuestModalProps) {
  const setPlayers = useSetPlayersState()
  const players = usePlayersValue()

  const handlePlayerSelect = (playerId: string) => {
    form.setFieldValue('matchedPlayer', playerId)
  }

  // 각 기존 선수당 최대 2명의 게스트만 받을 수 있도록 필터링
  const getPlayerGuestCount = (playerId: string) => players.filter((p) => p.isGuest && p.connectedPlayerIds?.includes(playerId)).length

  // 게스트 생성 객체 생성 함수
  const createGuestPlayer = (name: string, connectedPlayerId?: string): Player => {
    return new PlayerClass({
      id: `guest-${Date.now()}`,
      name,
      year: DEFAULT_YEAR,
      number: DEFAULT_NUMBER,
      tier: DEFAULT_TIER,
      condition: DEFAULT_CONDITION,
      strength: DEFAULT_STRENGTH,
      attributes: DEFAULT_ATTRIBUTES,
      isGuest: true,
      isActiveForMatch: true,
      connectedPlayerIds: connectedPlayerId ? [connectedPlayerId] : []
    })
  }

  // 게스트가 아니고 지원 1, 지원 2가 아니며 게스트가 2명 미만인 선수만 옵션에 포함
  const filteredPlayers = players.filter(
    (player) => !player.isGuest && player.name !== '지원 1' && player.name !== '지원 2' && getPlayerGuestCount(player.id) < 2
  )

  const playerOptions = filteredPlayers.map((player) => ({
    value: player.id,
    label: `${player.year.slice(-2)} ${player.name}`,
    player
  }))

  const onFinish = (values: { name: string; matchedPlayer?: string }) => {
    const newPlayer = createGuestPlayer(values.name, values.matchedPlayer)
    setPlayers((prevPlayers: Player[]) => {
      // 연결된 선수의 connectedPlayerIds에도 게스트 id 추가
      if (values.matchedPlayer) {
        return [
          newPlayer,
          ...prevPlayers.map((p) =>
            p.id === values.matchedPlayer ? { ...p, connectedPlayerIds: [...(p.connectedPlayerIds || []), newPlayer.id] } : p
          )
        ]
      }
      return [newPlayer, ...prevPlayers]
    })
    handleClose()
  }

  const handleClose = () => {
    form.resetFields()
    onOpenModal(false)()
  }

  return {
    onFinish,
    playerOptions,
    handlePlayerSelect,
    handleClose
  }
}
