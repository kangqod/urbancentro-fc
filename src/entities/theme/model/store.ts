import { create } from 'zustand'
import type { ThemeState } from './types'

interface ThemeStore extends ThemeState {
  setTheme: (value?: boolean) => void
}

export const KEY_DARK_MODE = 'darkMode'

const initialState: ThemeState = {
  isDarkMode: localStorage.getItem(KEY_DARK_MODE) === 'true' || false
}

export const useThemeStore = create<ThemeStore>((set) => ({
  ...initialState,
  setTheme: (value) =>
    set((state) => {
      const newTheme = value ?? !state.isDarkMode
      localStorage.setItem(KEY_DARK_MODE, String(newTheme)) // 로컬 스토리지에 저장
      return { isDarkMode: newTheme }
    }),
  resetThemeState: () => {
    localStorage.removeItem(KEY_DARK_MODE)
    set(initialState)
  }
}))
