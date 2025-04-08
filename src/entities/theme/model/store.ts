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
    set((state) => ({
      isDarkMode: value ?? !state.isDarkMode
    })),
  resetThemeState: () => set(initialState)
}))
