import { headers } from "next/headers"
import { detectWatchMapperLocale } from "../lib/locale-detection"
import { getMessages } from "next-intl/server"

export default async function GlobalNotFound() {
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language") || ""

  // Detect user's preferred locale
  const targetLocale = detectWatchMapperLocale(acceptLanguage)

  // Get messages for the detected locale
  const messages = await getMessages({ locale: targetLocale })
  const t = messages.notFound

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.title}</h2>
        <p className="text-gray-600 mb-8">{t.description}</p>
        <div className="space-x-4">
          <a
            href={`/${targetLocale}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t.home}
          </a>
          <a
            href={`/${targetLocale}/shops`}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t.discoverShops}
          </a>
        </div>
      </div>
    </div>
  )
}
