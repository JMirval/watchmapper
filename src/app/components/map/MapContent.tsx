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
        const isRepair = shop.type === "repair"

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
              className={`transition-all duration-300 hover:scale-110 cursor-pointer ${
                isRepair ? "map-marker-repair" : "map-marker-reseller"
              }`}
              style={{
                background: isRepair
                  ? "linear-gradient(135deg, #ff6b6b, #ee5a24, #ff4757)"
                  : "linear-gradient(135deg, #4834d4, #686de0, #30336b)",
                borderRadius: "50%",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #fff",
                fontSize: "28px",
                color: "#fff",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleMarkerClick(index)
              }}
            >
              {/* Animated background pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: isRepair
                    ? "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)"
                    : "radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
                }}
              />

              {/* Main icon */}
              <div className="relative z-10 drop-shadow-lg">{isRepair ? "🔧" : "⌚️"}</div>

              {/* Glowing effect */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{
                  background: isRepair
                    ? "radial-gradient(circle, rgba(255, 107, 107, 0.6) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(72, 52, 212, 0.6) 0%, transparent 70%)",
                }}
              />
            </div>
          </Marker>
        )
      })}
    </>
  )
}
