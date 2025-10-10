import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useSetActiveTabState } from '../../lib'
import { TabMenu } from '../../model'
import { checkUrbanFCPassword, KEY_PASSWORD } from '@/shared'

export default function useSecurity() {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const setActiveTab = useSetActiveTabState()

  const handleFinish = async (values: { password: string; password_status: boolean }) => {
    try {
      setLoading(true)

      await new Promise((resolve) => setTimeout(resolve, 500))
      const isValid = await checkUrbanFCPassword(values.password)
      if (isValid) {
        if (values.password_status) {
          localStorage.setItem(KEY_PASSWORD, values.password)
        }
        setActiveTab(TabMenu.TeamSetup)
      } else {
        throw new Error('Invalid password')
      }
    } catch (error) {
      messageApi.error('코드가 틀렸습니다!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('useEffect - load saved password')
    localStorage.removeItem(KEY_PASSWORD)
  }, [])

  return {
    loading,
    contextHolder,
    handleFinish
  }
}
