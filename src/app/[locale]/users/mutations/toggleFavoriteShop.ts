import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { z } from "zod"

const ToggleFavoriteShop = z.object({
  shopId: z.number(),
})

export default resolver.pipe(
  resolver.zod(ToggleFavoriteShop),
  resolver.authorize(),
  async (input, ctx) => {
    const { shopId } = input
    const userId = ctx.session.userId

    // Check if the shop exists
    const shop = await db.shop.findUnique({
      where: { id: shopId },
    })

    if (!shop) {
      throw new Error("Shop not found")
    }

    // Check if already favorited
    const existingFavorite = await db.userShop.findUnique({
      where: {
        userId_shopId: {
          userId,
          shopId,
        },
      },
    })

    if (existingFavorite) {
      // Remove from favorites
      await db.userShop.delete({
        where: {
          userId_shopId: {
            userId,
            shopId,
          },
        },
      })
      return { favorited: false }
    } else {
      // Add to favorites
      await db.userShop.create({
        data: {
          userId,
          shopId,
        },
      })
      return { favorited: true }
    }
  }
)
