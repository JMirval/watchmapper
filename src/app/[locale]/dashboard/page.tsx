"use client"
import { useCurrentUser } from "../users/hooks/useCurrentUser"
import { useRouter, useParams } from "next/navigation"
import { useQuery } from "@blitzjs/rpc"
import getDashboardStats from "../users/queries/getDashboardStats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Heart, Star, MapPin, TrendingUp, Watch, Wrench } from "lucide-react"
import { useTranslations } from "next-intl"

export default function DashboardPage() {
  const user = useCurrentUser()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations("dashboard")

  // Fetch dashboard statistics
  const [dashboardData] = useQuery(getDashboardStats, null, {
    refetchOnWindowFocus: false,
  })

  if (!user) {
    router.push(`/${locale}/login`)
    return null
  }

  const { stats, recentActivity } = dashboardData || {
    stats: {
      favoriteBrands: { count: 0, change: 0 },
      favoriteShops: { count: 0, change: 0 },
      reviews: { count: 0, change: 0 },
    },
    recentActivity: {
      favoriteBrands: [],
      favoriteShops: [],
      reviews: [],
    },
  }

  const formatChangeText = (change: number) => {
    if (change === 0) return "No change"
    const sign = change > 0 ? "+" : ""
    return `${sign}${change} from last month`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("welcomeBack", { name: user.name || user.email })}
          </h1>
          <p className="text-gray-600">{t("watchEnthusiast")}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t("memberSince", { date: new Date(user.createdAt).toLocaleDateString() })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("favoriteBrands")}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteBrands.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatChangeText(stats.favoriteBrands.change)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("favoriteShops")}</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteShops.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatChangeText(stats.favoriteShops.change)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("reviews")}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviews.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatChangeText(stats.reviews.change)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>{t("discoverLatest")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => router.push(`/${locale}/shops`)}
              >
                <MapPin className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{t("findShops")}</div>
                  <div className="text-xs text-muted-foreground text-wrap">
                    {t("findShopsDesc")}
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => router.push(`/${locale}/users/favorites`)}
              >
                <Heart className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{t("myFavorites")}</div>
                  <div className="text-xs text-muted-foreground text-wrap">
                    {t("myFavoritesDesc")}
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => router.push(`/${locale}/users/reviews`)}
              >
                <Star className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{t("myReviews")}</div>
                  <div className="text-xs text-muted-foreground text-wrap">
                    {t("myReviewsDesc")}
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => router.push(`/${locale}/users/profile`)}
              >
                <User className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{t("editProfile")}</div>
                  <div className="text-xs text-muted-foreground text-wrap">
                    {t("editProfileDesc")}
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Favorite Brands */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recentFavoriteBrands")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.favoriteBrands.length > 0 ? (
                  recentActivity.favoriteBrands.map((brand, index) => (
                    <div key={brand.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Watch className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Added {formatDate(brand.addedAt)}
                          </div>
                        </div>
                        <Badge variant="secondary">{brand.type}</Badge>
                      </div>
                      {index < recentActivity.favoriteBrands.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">{t("noFavoriteBrands")}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("startExploringBrands")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recentReviews")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.reviews.length > 0 ? (
                  recentActivity.reviews.map((review, index) => (
                    <div key={review.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{review.shopName}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Reviewed {formatDate(review.reviewedAt)}
                          </div>
                        </div>
                      </div>
                      {index < recentActivity.reviews.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("visitShopsAndReview")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
