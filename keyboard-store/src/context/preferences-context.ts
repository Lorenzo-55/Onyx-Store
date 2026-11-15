import { createContext, useContext } from 'react'
import { messages } from '../i18n/messages'
import { productMessages } from '../i18n/products'

export type Language = 'en' | 'it' | 'de'

export type Theme = 'light' | 'dark'

export const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'it', label: 'Italiano' },
  { id: 'de', label: 'Deutsch' },
] as const

export const LOCALES: Record<Language, string> = { en: 'en-US', it: 'it-IT', de: 'de-DE' }

export const LANGUAGE_KEY = 'onyx-language'

export const THEME_KEY = 'onyx-theme'

export function translate(
  language: Language,
  text: string,
  params: Record<string, string | number> = {},
) {
  const entry = messages[text] || productMessages[text]
  const value = language === 'en' ? text : entry?.[language === 'it' ? 0 : 1] || text
  return value.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] === undefined ? match : String(params[key]),
  )
}

export interface Preferences {
  language: Language
  theme: Theme
  setLanguage: (v: Language) => void
  setTheme: (v: Theme) => void
  t: (text: string, params?: Record<string, string | number>) => string
  money: (n: number) => string
}

export const PreferencesContext = createContext<Preferences | null>(null)

export function usePreferences() {
  const value = useContext(PreferencesContext)
  if (!value) throw new Error('PreferencesProvider is required')
  return value
}
