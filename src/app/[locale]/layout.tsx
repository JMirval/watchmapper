import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { locales } from "@/types"
import "../styles/globals.css"
import { BlitzProvider } from "../blitz-client"
import { Inter } from "next/font/google"
import { Navigation } from "./components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: { title: "WatchMapper", template: "%s – WatchMapper" },
  description: "Discover the best watch shops and brands",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <BlitzProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>{children}</main>
        </div>
      </BlitzProvider>
    </NextIntlClientProvider>
  )
}
