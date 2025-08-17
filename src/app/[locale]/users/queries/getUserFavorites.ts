import { resolver } from "@blitzjs/rpc"
import db from "@/db"

export default resolver.pipe(
  resolver.authorize(),
  async (_, ctx) => {
    const userId = ctx.session.userId

    const [favoriteBrands, favoriteShops] = await Promise.all([
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.userShop.findMany({
        where: { userId },
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              type: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ])

    return {
      brands: favoriteBrands.map((ub) => ub.brand),
      shops: favoriteShops.map((us) => us.shop),
    }
  }
)
