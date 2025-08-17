"use client"

import { Marker } from "@vis.gl/react-maplibre"
import { Shop } from "@/types"

interface MapContentProps {
  visibleShops: Shop[]
  handleMarkerClick: (index: number) => void
}

export default function MapContent({ visibleShops, handleMarkerClick }: MapContentProps) {
  return (
    <>
      {visibleShops.map((shop, index) => {
        return (
          <Marker
            key={shop.id}
            longitude={shop.lng}
            latitude={shop.lat}
            onClick={() => {
              handleMarkerClick(index)
            }}
          >
            <div
              style={{
                background:
                  shop.type === "repair"
                    ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  shop.type === "repair"
                    ? "0 4px 12px rgba(59,130,246,0.3)"
                    : "0 4px 12px rgba(16,185,129,0.3)",
                border: "3px solid #fff",
                fontSize: "24px",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleMarkerClick(index)
              }}
            >
              {shop.type === "repair" ? "🔧" : "⌚️"}
            </div>
          </Marker>
        )
      })}
    </>
  )
}
