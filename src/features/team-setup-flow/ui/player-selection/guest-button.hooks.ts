import { useMemo, useState } from 'react'
import { Form } from 'antd'
import { getSelectionStatus, useAvailablePlayerCountValue, useRequiredPlayersValue } from '../../lib'

export function useGuestButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form] = Form.useForm()

  const availablePlayerCount = useAvailablePlayerCountValue()
  const requiredPlayers = useRequiredPlayersValue()

  const status = useMemo(() => getSelectionStatus(availablePlayerCount, requiredPlayers), [availablePlayerCount, requiredPlayers])

  const handleModalOpen = (value: boolean) => () => {
    setIsModalOpen(value)
  }

  return {
    status,
    isModalOpen,
    form,
    handleModalOpen
  }
}
