import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { z } from "zod"

const GetShopDetails = z.object({
  shopId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetShopDetails),
  async (input) => {
    const { shopId } = input

    // Get shop with brands and reviews
    const shop = await db.shop.findUnique({
      where: { id: shopId },
      include: {
        brands: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!shop) {
      throw new Error("Shop not found")
    }

    // Calculate average rating and review count
    const reviewCount = shop.reviews.length
    const averageRating = reviewCount > 0 
      ? shop.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
      : 0

    return {
      shop: {
        id: shop.id,
        name: shop.name,
        type: shop.type,
        latitude: shop.latitude,
        longitude: shop.longitude,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
        brands: shop.brands,
      },
      reviews: shop.reviews,
      averageRating,
      reviewCount,
    }
  }
)
