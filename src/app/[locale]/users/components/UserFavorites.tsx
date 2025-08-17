"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserFavoritesProps {
  user: any
}

export function UserFavorites({ user }: UserFavoritesProps) {
  const favoriteBrands = user.favoriteBrands || []
  const favoriteShops = user.favoriteShops || []

  return (
    <div className="space-y-6">
      {/* Favorite Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🏷️ Favorite Brands</CardTitle>
        </CardHeader>
        <CardContent>
          {favoriteBrands.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {favoriteBrands.map((brand: any) => (
                <Card
                  key={brand.brand.id}
                  className="text-center p-3 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-2">
                    <div className="text-2xl mb-2">🏷️</div>
                    <div className="font-medium text-sm mb-1">{brand.brand.name}</div>
                    <Badge variant="secondary" className="text-xs">
                      {brand.brand.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">🏷️</div>
              <p>No favorite brands yet.</p>
              <p className="text-sm">Start exploring brands to add them to your favorites!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Shops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🏪 Favorite Shops</CardTitle>
        </CardHeader>
        <CardContent>
          {favoriteShops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favoriteShops.map((shop: any) => (
                <Card key={shop.shop.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🏪</div>
                      <div className="flex-1">
                        <div className="font-medium">{shop.shop.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {shop.shop.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">🏪</div>
              <p>No favorite shops yet.</p>
              <p className="text-sm">Start exploring shops to add them to your favorites!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
