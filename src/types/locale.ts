export interface LanguagePreference {
  language: string
  quality: number
}

// Can be imported from a shared config
export const locales = ["fr", "en"] as const
export type Locale = (typeof locales)[number]
