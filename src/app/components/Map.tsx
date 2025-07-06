"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import useFiltersStore from "@/stores/filters"
import { RESELLERS } from "@/lib/constants"

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

  return (
    <MapContainer center={[45.75, 4.85]} zoom={13} className={`w-full h-full z-0`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {visibleResellers.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={r.type === "repair" ? repairIcon : resellerIcon}
        >
          <Popup>
            <div className={``}>
              <div className={``}>{r.name}</div>
              <div>Type: {r.type.charAt(0).toUpperCase() + r.type.slice(1)}</div>
              <div>Brands: {r.brands.join(", ")}</div>
              <div>{r.address}</div>
              <div className={``}>
                {r.openNow ? (
                  <span className={``}>Open Now</span>
                ) : (
                  <span className={``}>Closed</span>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
