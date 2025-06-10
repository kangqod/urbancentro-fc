import { useShallow } from 'zustand/react/shallow'
import { useThemeStore } from '@/entities'

export function useThemeState(): [boolean, (value?: boolean) => void] {
  return useThemeStore(useShallow(({ isDarkMode, setTheme }) => [isDarkMode, setTheme]))
}
