"use client"

import dynamic from "next/dynamic"
import FilterPanel from "./FilterPanel"

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), { ssr: false })

export default function MapView() {
  return (
    <div className={`w-full h-lvh`}>
      {/* Filter Panel */}
      <FilterPanel />
      <Map />
    </div>
  )
}
