import { Button } from 'antd'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './theme.hooks'

import './theme.scss'

export function Theme() {
  const { isDarkMode, toggleTheme } = useTheme()

  return <Button onClick={toggleTheme} type="text" icon={isDarkMode ? <Moon size={24} /> : <Sun size={24} />} className="theme-button" />
}
