import { useThemeState } from '../lib'

export function useTheme() {
  const [isDarkMode, updateTheme] = useThemeState()

  const toggleTheme = () => {
    updateTheme(!isDarkMode)
  }

  return {
    isDarkMode,
    toggleTheme
  }
}
