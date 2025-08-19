"use client"

import { Map } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import useFiltersStore from "@/stores/filters"
import { useEffect, useRef, useState, useMemo } from "react"
import { Shop } from "@/types"
import MapContent from "./MapContent"
import CommandAtMarkerOverlay from "./CommandAtMarkerOverlay"

interface MapProps {
  shops: Shop[]
}

export default function MapComponent({ shops }: MapProps) {
  const filters = useFiltersStore((state) => state.filters)
  const mapRef = useRef<any>(null)
  const visibleShops = shops.filter((shop) => {
    if (filters.type && filters.type !== shop.type) {
      return false
    }
    if (
      shop.brands &&
      shop.brands.length > 0 &&
      filters.brands.length > 0 &&
      !shop.brands.some((b) => filters.brands.includes(b as any))
    ) {
      return false
    }
    return true
  })

  // Initialize open state based on visible shops length
  const [open, setOpen] = useState<number>(-1)

  // Update open state when visibleShops changes
  useEffect(() => {
    setOpen(-1)
  }, [visibleShops.length])

  // Calculate center based on visible shops or default to Lyon
  const center: [number, number] =
    visibleShops.length > 0 ? [visibleShops[0].lng, visibleShops[0].lat] : [4.85, 45.75]

  const handleMarkerClick = (index: number) => {
    setOpen(index)
  }

  const handleCloseMarker = (index: number) => {
    setOpen(-1)
  }

  const handleMapClick = () => {
    setOpen(-1)
  }

  // Prevent unnecessary re-renders by memoizing the center
  const memoizedCenter = useMemo(() => center, [center[0], center[1]])

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        initialViewState={{
          longitude: memoizedCenter[0],
          latitude: memoizedCenter[1],
          zoom: 13,
        }}
        onClick={handleMapClick}
      >
        <MapContent visibleShops={visibleShops} handleMarkerClick={handleMarkerClick} />
      </Map>

      {/* Render overlays outside of Map component for proper positioning */}
      <CommandAtMarkerOverlay
        visibleShops={visibleShops}
        open={open}
        onClose={handleCloseMarker}
        mapInstance={mapRef.current}
      />
    </div>
  )
}
