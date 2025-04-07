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
import { useSetPlayersState } from '../../lib'

interface UseGuestModalProps {
  form: FormInstance<any>
  onOpenModal: (value: boolean) => () => void
}
export function useGuestModal({ form, onOpenModal }: UseGuestModalProps) {
  const setPlayers = useSetPlayersState()

  const onFinish = (values: { name: string }) => {
    const newPlayer: Player = new PlayerClass({
      id: `guest-${Date.now()}`,
      name: values.name,
      year: DEFAULT_YEAR,
      number: DEFAULT_NUMBER,
      tier: DEFAULT_TIER,
      condition: DEFAULT_CONDITION,
      strength: DEFAULT_STRENGTH,
      attributes: DEFAULT_ATTRIBUTES,
      isGuest: true,
      isAvailable: true
    })

    setPlayers((prevPlayers: Player[]) => [newPlayer, ...prevPlayers])

    onOpenModal(false)()
    form.resetFields()
  }

  return {
    onFinish
  }
}
