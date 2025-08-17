import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import { locales, Locale } from "@/types"

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Fallback to French if locale is not supported
    locale = "fr"
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
