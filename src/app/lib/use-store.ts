import { useShallow } from 'zustand/react/shallow'
import { useThemeStore } from '@/entities'

export function useThemeValue() {
  return useThemeStore(useShallow(({ isDarkMode }) => isDarkMode))
}
