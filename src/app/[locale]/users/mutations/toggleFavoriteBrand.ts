import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { z } from "zod"

const ToggleFavoriteBrand = z.object({
  brandId: z.number(),
})

export default resolver.pipe(
  resolver.zod(ToggleFavoriteBrand),
  resolver.authorize(),
  async (input, ctx) => {
    const { brandId } = input
    const userId = ctx.session.userId

    // Check if the brand exists
    const brand = await db.brand.findUnique({
      where: { id: brandId },
    })

    if (!brand) {
      throw new Error("Brand not found")
    }

    // Check if already favorited
    const existingFavorite = await db.userBrand.findUnique({
      where: {
        userId_brandId: {
          userId,
          brandId,
        },
      },
    })

    if (existingFavorite) {
      // Remove from favorites
      await db.userBrand.delete({
        where: {
          userId_brandId: {
            userId,
            brandId,
          },
        },
      })
      return { favorited: false }
    } else {
      // Add to favorites
      await db.userBrand.create({
        data: {
          userId,
          brandId,
        },
      })
      return { favorited: true }
    }
  }
)
