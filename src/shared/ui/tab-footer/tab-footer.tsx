import { type ReactNode } from 'react'

import './tab-footer.scss'

interface TabFooterProps {
  children: ReactNode
}

export function TabFooter({ children }: TabFooterProps) {
  return <div className="tab-footer">{children}</div>
}
