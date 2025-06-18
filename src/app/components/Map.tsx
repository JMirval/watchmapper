"use client"
import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix default icon issue in Leaflet (optional, but good practice)
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

// Custom divIcon for repair and reseller with emoji in a white circle
const repairIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div style="background:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid #eee;font-size:24px;">🔧</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})
const resellerIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div style="background:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid #eee;font-size:24px;">⌚️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

// Sample data for resellers/repair shops
const RESELLERS = [
  {
    id: 1,
    name: "Lyon Watch Repair",
    type: "repair",
    brand: "Rolex, Omega",
    openNow: true,
    lat: 45.7602,
    lng: 4.8357,
    address: "12 Rue de la Montée, 69001 Lyon",
  },
  {
    id: 2,
    name: "Montres & Co Reseller",
    type: "reseller",
    brand: "Seiko, Citizen",
    openNow: false,
    lat: 45.7485,
    lng: 4.8467,
    address: "8 Place Bellecour, 69002 Lyon",
  },
  {
    id: 3,
    name: "Luxury Time Lyon",
    type: "reseller",
    brand: "Rolex, Patek Philippe",
    openNow: true,
    lat: 45.7578,
    lng: 4.832,
    address: "5 Rue de la République, 69001 Lyon",
  },
  {
    id: 4,
    name: "Horlogerie du Rhône",
    type: "repair",
    brand: "Omega, Tissot",
    openNow: false,
    lat: 45.7512,
    lng: 4.8571,
    address: "22 Quai du Rhône, 69006 Lyon",
  },
]

export default function Map() {
  // Example filter state
  const [filters, setFilters] = useState({
    type: "",
    brand: "",
    openNow: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
    }))
  }

  // For now, show all resellers (filtering can be added later)
  const visibleResellers = RESELLERS

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* Side Panel */}
      <div
        style={{
          width: 300,
          background: "#fff",
          padding: 24,
          boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
          zIndex: 1000,
        }}
      >
        <h1>WatchMapper</h1>
        <h3>Filter Watch Services</h3>
        <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>
            Type
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              style={{ width: "100%", marginTop: 4 }}
            >
              <option value="">All</option>
              <option value="repair">Repair</option>
              <option value="reseller">Reseller</option>
            </select>
          </label>
          <label>
            Brand
            <input
              type="text"
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              placeholder="e.g. Rolex, Omega"
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              name="openNow"
              checked={filters.openNow}
              onChange={handleChange}
            />
            Open Now
          </label>
        </form>
      </div>
      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={[45.75, 4.85]} zoom={13} style={{ width: "100%", height: "100%" }}>
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
                <strong>{r.name}</strong>
                <br />
                Type: {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                <br />
                Brands: {r.brand}
                <br />
                {r.address}
                <br />
                {r.openNow ? (
                  <span style={{ color: "green" }}>Open Now</span>
                ) : (
                  <span style={{ color: "red" }}>Closed</span>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
