import { useToastMessage } from './toast-message.hooks'

export function ToastMessage() {
  const { contextHolder } = useToastMessage()

  return <>{contextHolder}</>
}
