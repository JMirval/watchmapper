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
      <div className="w-full h-lvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loadingMap")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-lvh flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Map</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
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
          className="bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Stats</span>
        </Button>
      </div>

      {/* Stats Card */}
      {showStats && (
        <div className="absolute top-16 right-4 z-10">
          <Card className="w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t("stats.title")}</CardTitle>
              <CardDescription>{t("stats.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{allShops.length}</div>
                  <div className="text-sm text-gray-600">{t("stats.totalShops")}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalReviews}</div>
                  <div className="text-sm text-gray-600">{t("stats.totalReviews")}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{t("stats.repairShops")}</span>
                  </div>
                  <Badge variant="secondary">{repairShops.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Watch className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{t("stats.resellerShops")}</span>
                  </div>
                  <Badge variant="secondary">{resellerShops.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{t("stats.avgRating")}</span>
                  </div>
                  <Badge variant="secondary">{averageRating.toFixed(1)}</Badge>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-xs text-gray-500">
                  {t("stats.lastUpdated", { date: new Date().toLocaleDateString() })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shop Count Badge */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
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
        <div className="w-full h-lvh flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loadingMap")}</p>
          </div>
        </div>
      }
    >
      <MapViewContent />
    </Suspense>
  )
}
