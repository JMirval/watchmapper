import { resolver } from "@blitzjs/rpc"
import db from "@/db"

export default resolver.pipe(
  resolver.authorize(),
  async (_, ctx) => {
    const userId = ctx.session.userId

    // Get current month and last month for comparison
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Fetch all data in parallel for better performance
    const [
      favoriteBrandsCount,
      favoriteShopsCount,
      reviewsCount,
      favoriteBrandsLastMonth,
      favoriteShopsLastMonth,
      reviewsLastMonth,
      recentFavoriteBrands,
      recentFavoriteShops,
      recentReviews,
    ] = await Promise.all([
      // Current counts
      db.userBrand.count({ where: { userId } }),
      db.userShop.count({ where: { userId } }),
      db.review.count({ where: { userId } }),

      // Last month counts for comparison
      db.userBrand.count({
        where: {
          userId,
          createdAt: { lt: currentMonth },
        },
      }),
      db.userShop.count({
        where: {
          userId,
          createdAt: { lt: currentMonth },
        },
      }),
      db.review.count({
        where: {
          userId,
          createdAt: { lt: currentMonth },
        },
      }),

      // Recent favorite brands (last 5)
      db.userBrand.findMany({
        where: { userId },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent favorite shops (last 5)
      db.userShop.findMany({
        where: { userId },
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent reviews (last 5)
      db.review.findMany({
        where: { userId },
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    // Calculate month-over-month changes
    const favoriteBrandsChange = favoriteBrandsCount - favoriteBrandsLastMonth
    const favoriteShopsChange = favoriteShopsCount - favoriteShopsLastMonth
    const reviewsChange = reviewsCount - reviewsLastMonth

    return {
      stats: {
        favoriteBrands: {
          count: favoriteBrandsCount,
          change: favoriteBrandsChange,
        },
        favoriteShops: {
          count: favoriteShopsCount,
          change: favoriteShopsChange,
        },
        reviews: {
          count: reviewsCount,
          change: reviewsChange,
        },
      },
      recentActivity: {
        favoriteBrands: recentFavoriteBrands.map((ub) => ({
          id: ub.brand.id,
          name: ub.brand.name,
          type: ub.brand.type,
          addedAt: ub.createdAt,
        })),
        favoriteShops: recentFavoriteShops.map((us) => ({
          id: us.shop.id,
          name: us.shop.name,
          type: us.shop.type,
          addedAt: us.createdAt,
        })),
        reviews: recentReviews.map((review) => ({
          id: review.id,
          shopName: review.shop.name,
          shopType: review.shop.type,
          rating: review.rating,
          comment: review.comment,
          reviewedAt: review.createdAt,
        })),
      },
    }
  }
)
