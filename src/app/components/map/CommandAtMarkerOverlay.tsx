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

        return (
          <div
            ref={containerRef}
            key={shop.id + "overlay"}
            className="absolute z-[500] pointer-events-auto"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -108%)", // align top center of marker
            }}
          >
            <Card className="w-72 md:w-80 py-0 gap-2 shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              {/* Header with gradient background */}
              <CardHeader className="p-0">
                <div
                  className={`p-4 ${
                    shop.type === "repair"
                      ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                      : "bg-gradient-to-r from-green-500 via-green-600 to-green-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-white mb-1 truncate">
                        {shop.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-blue-100">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="text-sm truncate">{shop.address}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
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
                {/* Rating and type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {shop.averageRating > 0 ? (
                      <>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{shop.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({shop.reviewCount} {t("reviews")})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t("noReviewsYet")}</span>
                    )}
                  </div>
                  {shop.type === "repair" ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      {t("repair")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      <Watch className="h-3 w-3 mr-1" />
                      {t("reseller")}
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Brands section */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-3 text-gray-900">{t("availableBrands")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.brands && shop.brands.length > 0 ? (
                      shop.brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200"
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
                          <span className="text-xs font-medium text-gray-700">{brand}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">{t("noBrandsListed")}</span>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Quick info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{t("open")} • 9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                  </Button>
                  <Button
                    onClick={() => alert(t("calling", { name: shop.name }))}
                    variant="outline"
                    size="sm"
                    className="flex-1"
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
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onClose(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
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
