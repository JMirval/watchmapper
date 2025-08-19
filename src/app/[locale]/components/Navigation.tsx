"use client"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { UserMenu } from "@/components/UserMenu"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ClientOnly } from "@/components/ClientOnly"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const t = useTranslations("navigation")
  const params = useParams()
  const locale = params.locale as string
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: `/${locale}/shops`, label: t("discoverShops") },
    { href: `/${locale}/dashboard`, label: t("dashboard") },
  ]

  const MobileMenu = () => (
    <div className="md:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 p-4">
              <Link href={`/${locale}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center">
                  <Image
                    src="/watchmapper.png"
                    alt="WatchMapper"
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                  <h1 className="text-xl font-bold text-gray-900">{t("appName")}</h1>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom Section */}
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t("language")}</span>
                <ClientOnly>
                  <LanguageSwitcher variant="mobile" />
                </ClientOnly>
              </div>
              <div className="border-t pt-4">
                <ClientOnly>
                  <UserMenu variant="mobile" />
                </ClientOnly>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-6">
            <Link href={`/${locale}`}>
              <div className="flex items-center">
                <Image
                  src="/watchmapper.png"
                  alt="WatchMapper"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <h1 className="text-xl font-bold text-gray-900">{t("appName")}</h1>
              </div>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <ClientOnly>
              <LanguageSwitcher />
            </ClientOnly>
            <ClientOnly>
              <UserMenu />
            </ClientOnly>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
}
