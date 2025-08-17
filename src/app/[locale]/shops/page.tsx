"use client"
import { useQuery } from "@blitzjs/rpc"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import getShops from "./queries/getShops"
import getBrands from "../brands/queries/getBrands"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Star, Heart, Filter, X, Navigation } from "lucide-react"

export default function ShopsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = params.locale as string

  // State for filters
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [brandId, setBrandId] = useState(searchParams.get("brandId") || "")
  const [minRating, setMinRating] = useState(parseInt(searchParams.get("minRating") || "0"))
  const [maxDistance, setMaxDistance] = useState(parseInt(searchParams.get("maxDistance") || "50"))
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc")
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
        }
      )
    }
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (type) params.set("type", type)
    if (brandId) params.set("brandId", brandId)
    if (minRating > 0) params.set("minRating", minRating.toString())
    if (maxDistance !== 50) params.set("maxDistance", maxDistance.toString())
    if (sortBy !== "name") params.set("sortBy", sortBy)
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder)
    if (page > 1) params.set("page", page.toString())

    const newUrl = params.toString() ? `?${params.toString()}` : ""
    router.replace(`/${locale}/shops${newUrl}`, { scroll: false })
  }, [search, type, brandId, minRating, maxDistance, sortBy, sortOrder, page, router, locale])

  // Queries
  const [shopsData] = useQuery(getShops, {
    search: search || undefined,
    type: type || undefined,
    brandId: brandId ? parseInt(brandId) : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    maxDistance: maxDistance !== 50 ? maxDistance : undefined,
    userLat: userLocation?.lat,
    userLng: userLocation?.lng,
    page,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
  })

  const [brands] = useQuery(getBrands, {})

  const { shops, pagination } = shopsData || { shops: [], pagination: { page: 1, totalPages: 1 } }

  const shopTypes = [
    "Jewelry Store",
    "Watch Boutique",
    "Department Store",
    "Online Retailer",
    "Authorized Dealer",
  ]

  const clearFilters = () => {
    setSearch("")
    setType("")
    setBrandId("")
    setMinRating(0)
    setMaxDistance(50)
    setSortBy("name")
    setSortOrder("asc")
    setPage(1)
  }

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Discover Watch Shops</h1>
          <p className="text-muted-foreground">Find the perfect place to buy your next timepiece</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filters
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shops, brands, or types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                {/* Shop Type */}
                <div className="space-y-2">
                  <Label>Shop Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {shopTypes.map((shopType) => (
                        <SelectItem key={shopType} value={shopType}>
                          {shopType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={brandId} onValueChange={setBrandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="All brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Minimum Rating: {minRating > 0 ? `${minRating}+ stars` : "Any"}</Label>
                  <Slider
                    value={[minRating]}
                    onValueChange={([value]) => setMinRating(value)}
                    max={5}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Distance */}
                <div className="space-y-2">
                  <Label>Max Distance: {maxDistance}km</Label>
                  <Slider
                    value={[maxDistance]}
                    onValueChange={([value]) => setMaxDistance(value)}
                    max={100}
                    min={1}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Label>Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="createdAt">Newest</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{pagination.total} shops found</p>
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                Using your location
              </div>
            )}
          </div>

          {/* Shop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop: any) => (
              <Card key={shop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{shop.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{shop.type}</Badge>
                        {shop.distance && (
                          <Badge variant="outline" className="text-xs">
                            {formatDistance(shop.distance)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= shop.averageRating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {shop.averageRating.toFixed(1)} ({shop.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Brands */}
                  {shop.brands.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Brands:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {shop.brands.slice(0, 3).map((brand: any) => (
                          <Badge key={brand.id} variant="outline" className="text-xs">
                            {brand.name}
                          </Badge>
                        ))}
                        {shop.brands.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{shop.brands.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
