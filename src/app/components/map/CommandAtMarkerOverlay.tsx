"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Phone,
  Watch,
  Wrench,
  Star,
  MapPin,
  Clock,
  Heart,
  Share2,
  Navigation,
  X,
} from "lucide-react"
import Image from "next/image"
import { Shop } from "@/types"
import { useTranslations } from "next-intl"

interface CommandAtMarkerOverlayProps {
  visibleShops: Shop[]
  open: number
  onClose: (index: number) => void
  mapInstance: any
}

export default function CommandAtMarkerOverlay({
  visibleShops,
  open,
  onClose,
  mapInstance,
}: CommandAtMarkerOverlayProps) {
  const t = useTranslations("map")
  const [positions, setPositions] = useState<Array<{ top: number; left: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePositions = useCallback(() => {
    if (!mapInstance || !mapInstance.isStyleLoaded()) {
      return
    }

    try {
      const newPositions = visibleShops.map((shop) => {
        // Use MapLibre's project method to get screen coordinates
        const point = mapInstance.project([shop.lng, shop.lat])
        return { top: point.y, left: point.x }
      })
      setPositions(newPositions)
    } catch (error) {
      console.error("Error updating positions:", error)
    }
  }, [mapInstance, visibleShops])

  useEffect(() => {
    if (mapInstance) {
      // Wait for map to be ready
      const checkMapReady = () => {
        if (mapInstance.isStyleLoaded()) {
          updatePositions()
        } else {
          setTimeout(checkMapReady, 100)
        }
      }

      checkMapReady()

      // Listen for map movement and zoom events
      const handleMove = () => updatePositions()
      const handleZoom = () => updatePositions()

      mapInstance.on("move", handleMove)
      mapInstance.on("zoom", handleZoom)
      mapInstance.on("style.load", updatePositions)

      return () => {
        mapInstance.off("move", handleMove)
        mapInstance.off("zoom", handleZoom)
        mapInstance.off("style.load", updatePositions)
      }
    }
  }, [mapInstance, updatePositions])

  return (
    <>
      {visibleShops.map((shop, index) => {
        if (open !== index) {
          return null
        }

        const pos = positions[index] || { top: 0, left: 0 }
        const isRepair = shop.type === "repair"

        return (
          <div
            ref={containerRef}
            key={shop.id + "overlay"}
            className="absolute z-[500] pointer-events-auto map-overlay-enter"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -108%)", // align top center of marker
            }}
          >
            <Card className="w-72 md:w-80 py-0 gap-2 shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              {/* Header with vibrant gradient background */}
              <CardHeader className="p-0">
                <div
                  className={`p-4 relative overflow-hidden ${
                    isRepair
                      ? "bg-gradient-to-br from-red-400 via-red-500 to-orange-500"
                      : "bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600"
                  }`}
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse" />
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-white mb-1 truncate drop-shadow-lg">
                        {shop.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-white/90">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="text-sm truncate">{shop.address}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                      onClick={() => {
                        // Handle favorite toggle
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                {/* Rating and type with enhanced styling */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {shop.averageRating > 0 ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                          <span className="text-sm font-bold text-gray-800">
                            {shop.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({shop.reviewCount} {t("reviews")})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t("noReviewsYet")}</span>
                    )}
                  </div>
                  {isRepair ? (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-200 font-semibold px-3 py-1"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      {t("repair")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200 font-semibold px-3 py-1"
                    >
                      <Watch className="h-3 w-3 mr-1" />
                      {t("reseller")}
                    </Badge>
                  )}
                </div>

                <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Brands section with enhanced styling */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-3 text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></span>
                    {t("availableBrands")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.brands && shop.brands.length > 0 ? (
                      shop.brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center gap-2 px-3 py-2 brand-chip rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <Image
                            src={`/brands/${brand.toLowerCase().replace(" ", "-")}.png`}
                            alt={brand}
                            width={16}
                            height={16}
                            className="rounded-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                          <span className="text-xs font-semibold text-gray-700">{brand}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">{t("noBrandsListed")}</span>
                    )}
                  </div>
                </div>

                <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Quick info with enhanced styling */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gray-700 transition-colors duration-200">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{t("open")} • 9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gray-700 transition-colors duration-200">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span>+33 4 XX XX XX XX</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`
                      window.open(url, "_blank")
                    }}
                    className={`flex-1 text-white font-semibold transition-all duration-200 hover:scale-105 ${
                      isRepair
                        ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    }`}
                    size="sm"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                  </Button>
                  <Button
                    onClick={() => alert(t("calling", { name: shop.name }))}
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        try {
                          if (navigator.share) {
                            await navigator.share({
                              title: shop.name,
                              text: t("checkOutShop", { name: shop.name, type: shop.type }),
                              url: window.location.href,
                            })
                          } else if (navigator.clipboard) {
                            await navigator.clipboard.writeText(`${shop.name} - ${shop.address}`)
                            alert(t("shopInformationCopied"))
                          } else {
                            const textArea = document.createElement("textarea")
                            textArea.value = `${shop.name} - ${shop.address}`
                            document.body.appendChild(textArea)
                            textArea.select()
                            document.execCommand("copy")
                            document.body.removeChild(textArea)
                            alert(t("shopInformationCopied"))
                          }
                        } catch (error) {
                          console.error("Error sharing:", error)
                          alert(t("unableToShare"))
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onClose(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        )
      })}
    </>
  )
}
