"use client"

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import useFiltersStore from "@/stores/filters"
import { RESELLERS } from "@/lib/constants"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Reseller, ShopType } from "@/lib/types"
import { Badge } from "./ui/badge"
import { Phone, Watch, Wrench } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

// Fix default icon issue in Leaflet (optional, but good practice)
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

// Custom divIcon for repair and reseller with emoji in a white circle
const repairIcon = L.divIcon({
  className: "",
  html: `<div style="background:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid #eee;font-size:24px;">🔧</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})
const resellerIcon = L.divIcon({
  className: "",
  html: `<div style="background:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid #eee;font-size:24px;">⌚️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

const markerLatLng: [number, number] = [45.75, 4.85]

function CommandAtMarker({
  open,
  onClose,
  reseller,
}: {
  open: boolean
  onClose: () => void
  reseller: Reseller
}) {
  const map = useMap()
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    const point = map.latLngToContainerPoint(L.latLng([reseller.lat, reseller.lng]))
    setPos({ top: point.y, left: point.x })
  }, [map, reseller])

  useEffect(() => {
    updatePosition()
    map.on("move", updatePosition)
    map.on("zoom", updatePosition)
    return () => {
      map.off("move", updatePosition)
      map.off("zoom", updatePosition)
    }
  }, [map, updatePosition])

  if (!open) return null

  return (
    <div
      ref={containerRef}
      className="absolute z-[500]"
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -125%)", // align top center of marker
      }}
    >
      <Card className="p-2 shadow-xl rounded-2xl w-72">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{reseller.name}</CardTitle>
          <CardDescription>{reseller.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {reseller.type === ShopType.Repair ? (
                <Badge variant="outline">
                  <Wrench />
                  Repair
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Watch />
                  Reseller
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {reseller.brands.map((b) => (
                <Button variant="outline" key={b}>
                  <Image src={`/brands/${b}.png`} alt={b} width={40} height={40} />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-stretch gap-2 w-full">
          <Button onClick={onClose} className="w-full">
            <Phone /> Call
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function Map() {
  const filters = useFiltersStore((state) => state.filters)
  const visibleResellers = RESELLERS.filter((r) => {
    if (filters.type && filters.type !== r.type) {
      return false
    }
    if (r.brands.length > 0 && !r.brands.some((b) => filters.brands.includes(b))) {
      return false
    }
    if (filters.openNow && !r.openNow) {
      return false
    }
    return true
  })

  const [open, setOpen] = useState(Array(RESELLERS.length).fill(false))
  console.log(open)

  return (
    <MapContainer
      center={[45.75, 4.85]}
      zoom={13}
      className={`w-full h-full z-0`}
      closePopupOnClick
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{
          click: () => {
            console.log("click")
            setOpen(Array(RESELLERS.length).fill(false))
          },
          mousedown: () => {
            console.log("mousedown")
          },
        }}
      />
      {visibleResellers.map((r, index) => (
        <Fragment key={r.id}>
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={r.type === "repair" ? repairIcon : resellerIcon}
            eventHandlers={{
              click: () => {
                setOpen(open.map((o, i) => (i === index ? !o : o)))
              },
            }}
          />
          <CommandAtMarker
            key={r.id + "command"}
            open={open[index]}
            onClose={() => setOpen(open.map((o, i) => (i === index ? false : o)))}
            reseller={r}
          />
        </Fragment>
      ))}
    </MapContainer>
  )
}
