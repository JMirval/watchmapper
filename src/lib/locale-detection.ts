import { LanguagePreference } from "@/types"

export function parseAcceptLanguage(acceptLanguage: string): LanguagePreference[] {
  if (!acceptLanguage) return []
  
  return acceptLanguage
    .split(",")
    .map((lang: string) => {
      const [language, quality = "1"] = lang.trim().split(";q=")
      return {
        language: language.split("-")[0].toLowerCase(), // Get primary language code
        quality: parseFloat(quality)
      }
    })
    .sort((a: LanguagePreference, b: LanguagePreference) => b.quality - a.quality)
}

export function detectPreferredLocale(acceptLanguage: string, supportedLocales: string[]): string {
  const preferences = parseAcceptLanguage(acceptLanguage)
  
  // Check if any of the user's preferred languages are supported
  for (const preference of preferences) {
    if (supportedLocales.includes(preference.language)) {
      return preference.language
    }
  }
  
  // Fallback to default locale (first in the array)
  return supportedLocales[0] || "fr"
}

// Specific function for our app
export function detectWatchMapperLocale(acceptLanguage: string): "fr" | "en" {
  const supportedLocales = ["fr", "en"]
  const detected = detectPreferredLocale(acceptLanguage, supportedLocales)
  
  // Ensure we return only supported locales
  return (detected === "en" ? "en" : "fr") as "fr" | "en"
}
