"use client"

import dynamic from "next/dynamic"
import FilterPanel from "./FilterPanel"
import { useQuery } from "@blitzjs/rpc"
import getShopsForMap from "../[locale]/shops/queries/getShopsForMap"
import { Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, Star, Watch, Wrench, Users, TrendingUp, Filter } from "lucide-react"
import { useTranslations } from "next-intl"

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./map/Map"), { ssr: false })

function MapViewContent() {
  const t = useTranslations("map")
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [shops] = useQuery(getShopsForMap, undefined, {
    enabled: isClient,
    onError: (error: any) => {
      console.error("Query error:", error)
      setError(error.message || "Unknown error occurred")
    },
  })

  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {}, [shops])

  if (!isClient) {
    return (
      <div className="w-full h-lvh flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6 shadow-lg"></div>
          <p className="text-gray-700 font-medium text-lg">{t("loadingMap")}</p>
          <div className="mt-4 w-32 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-lvh flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Map</h2>
          <p className="text-gray-700 mb-6 max-w-md">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const allShops = shops || []

  const repairShops = allShops.filter((shop) => shop.type === "repair")
  const resellerShops = allShops.filter((shop) => shop.type === "reseller")
  const totalReviews = allShops.reduce((sum, shop) => sum + shop.reviewCount, 0)
  const averageRating =
    allShops.length > 0
      ? allShops.reduce((sum, shop) => sum + shop.averageRating, 0) / allShops.length
      : 0

  return (
    <div className={`w-full h-lvh relative`}>
      {/* Map - takes full container and stays stable */}
      <div className="w-full h-full">
        <Map shops={allShops} />
      </div>

      {/* Filter Panel - positioned absolutely */}
      <div className="absolute top-4 left-4 z-10">
        <FilterPanel />
      </div>

      {/* Stats Panel - positioned absolutely */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="bg-white/95 backdrop-blur-sm hover:bg-white px-4 py-2 shadow-lg border-0 font-semibold transition-all duration-200 hover:scale-105"
        >
          <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
          <span className="hidden sm:inline gradient-text-purple">Stats</span>
        </Button>
      </div>

      {/* Stats Card */}
      {showStats && (
        <div className="absolute top-16 right-4 z-10 animate-in slide-in-from-top-2 duration-300">
          <Card className="w-80 max-w-[calc(100vw-2rem)] py-0 bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
            <CardHeader className="py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <CardTitle className="text-lg font-bold">{t("stats.title")}</CardTitle>
              <CardDescription className="text-purple-100">
                {t("stats.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="text-3xl font-bold text-blue-600">{allShops.length}</div>
                  <div className="text-sm text-gray-700 font-medium">{t("stats.totalShops")}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="text-3xl font-bold text-green-600">{totalReviews}</div>
                  <div className="text-sm text-gray-700 font-medium">{t("stats.totalReviews")}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      {t("stats.repairShops")}
                    </span>
                  </div>
                  <Badge className="bg-blue-500 text-white font-bold px-3 py-1">
                    {repairShops.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Watch className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      {t("stats.resellerShops")}
                    </span>
                  </div>
                  <Badge className="bg-green-500 text-white font-bold px-3 py-1">
                    {resellerShops.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      {t("stats.avgRating")}
                    </span>
                  </div>
                  <Badge className="bg-yellow-500 text-white font-bold px-3 py-1">
                    {averageRating.toFixed(1)}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  {t("stats.lastUpdated", { date: new Date().toLocaleDateString() })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shop Count Badge */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-200 hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">
              {t("stats.shopsFound", { count: allShops.length })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MapView() {
  const t = useTranslations("map")

  return (
    <Suspense
      fallback={
        <div className="w-full h-lvh flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6 shadow-lg"></div>
            <p className="text-gray-700 font-medium text-lg">{t("loadingMap")}</p>
            <div className="mt-4 w-32 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      }
    >
      <MapViewContent />
    </Suspense>
  )
}
