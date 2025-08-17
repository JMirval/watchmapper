import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { detectWatchMapperLocale } from "../lib/locale-detection"

export default async function RootPage() {
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language") || ""

  // Detect user's preferred locale
  const targetLocale = detectWatchMapperLocale(acceptLanguage)

  // Redirect to preferred language
  redirect(`/${targetLocale}`)
}
