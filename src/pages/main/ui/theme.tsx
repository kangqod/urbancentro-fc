import { Sun, Moon } from 'lucide-react'
import { Button } from 'antd'
import { useThemeState } from '../lib'
import { useEffect } from 'react'

export function Theme() {
  const [isDarkMode, updateTheme] = useThemeState()
  const toggleTheme = () => {
    updateTheme(!isDarkMode)
  }
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    document.body.classList.toggle('light-mode', !isDarkMode)
  }, [isDarkMode])

  return <Button onClick={toggleTheme} type="text" icon={isDarkMode ? <Moon size={24} /> : <Sun size={24} />} className="theme-button" />
}
