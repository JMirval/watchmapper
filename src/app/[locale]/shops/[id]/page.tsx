"use client"
import { useQuery } from "@blitzjs/rpc"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import getShopDetails from "./queries/getShopDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Star, 
  Heart, 
  Phone, 
  Globe, 
  Clock, 
  Navigation,
  ArrowLeft,
  Share2,
  MessageSquare
} from "lucide-react"
import { useTranslations } from "next-intl"

export default function ShopDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const shopId = parseInt(params.id as string)
  const t = useTranslations("shopDetails")

  const [shopData] = useQuery(getShopDetails, { shopId })
  const [isFavorite, setIsFavorite] = useState(false) // TODO: Implement favorite functionality

  if (!shopData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading shop details...</p>
        </div>
      </div>
    )
  }

  const { shop, reviews, averageRating, reviewCount } = shopData

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <p className="text-muted-foreground">{shop.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={isFavorite ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shop Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t("overview")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{shop.type}</Badge>
                  {shop.distance && (
                    <Badge variant="outline">
                      <Navigation className="h-3 w-3 mr-1" />
                      {formatDistance(shop.distance)}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({reviewCount} {t("reviews")})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t("memberSince")} {formatDate(shop.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brands */}
            {shop.brands.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("availableBrands")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {shop.brands.map((brand) => (
                      <div key={brand.id} className="flex items-center gap-2 p-2 border rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{brand.name}</div>
                          <div className="text-xs text-muted-foreground">{brand.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("reviews")}</span>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("writeReview")}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={review.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {review.comment}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{review.user.name || review.user.email}</span>
                              <span>{formatDate(review.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        {index < reviews.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t("noReviews")}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("beFirstToReview")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("contactInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  {t("getDirections")}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("quickActions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  {t("callShop")}
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  {t("visitWebsite")}
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("sendMessage")}
                </Button>
              </CardContent>
            </Card>

            {/* Similar Shops */}
            <Card>
              <CardHeader>
                <CardTitle>{t("similarShops")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    {t("similarShopsComingSoon")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
