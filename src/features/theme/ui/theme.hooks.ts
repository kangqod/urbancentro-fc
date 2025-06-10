import { useEffect } from 'react'
import { useThemeState } from '../lib'

export function useTheme() {
  const [isDarkMode, updateTheme] = useThemeState()

  const toggleTheme = () => {
    updateTheme(!isDarkMode)
  }

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    document.body.classList.toggle('light-mode', !isDarkMode)
  }, [isDarkMode])

  return {
    isDarkMode,
    toggleTheme
  }
}
