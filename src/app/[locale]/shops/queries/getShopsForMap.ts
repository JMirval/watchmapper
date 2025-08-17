import { resolver } from "@blitzjs/rpc"
import db from "@/db"

export default resolver.pipe(async () => {
  const shops = await db.shop.findMany({
    include: {
      brands: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  })

  return shops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    type: shop.type,
    brands: shop.brands.map((brand) => brand.name),
    lat: shop.latitude,
    lng: shop.longitude,
    address: `${shop.name}, ${shop.latitude}, ${shop.longitude}`, // We'll need to add address field to schema later
    averageRating: shop.reviews.length > 0 
      ? shop.reviews.reduce((sum, review) => sum + review.rating, 0) / shop.reviews.length 
      : 0,
    reviewCount: shop.reviews.length,
  }))
})
