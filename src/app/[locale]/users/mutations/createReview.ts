import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { Review } from "@/lib/validations"

export default resolver.pipe(
  resolver.zod(Review),
  resolver.authorize(),
  async (input, ctx) => {
    const { rating, comment, shopId } = input
    const userId = ctx.session.userId

    // Check if the shop exists
    const shop = await db.shop.findUnique({
      where: { id: shopId },
    })

    if (!shop) {
      throw new Error("Shop not found")
    }

    // Check if user already reviewed this shop
    const existingReview = await db.review.findUnique({
      where: {
        userId_shopId: {
          userId,
          shopId,
        },
      },
    })

    if (existingReview) {
      // Update existing review
      const review = await db.review.update({
        where: {
          userId_shopId: {
            userId,
            shopId,
          },
        },
        data: {
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })
      return review
    } else {
      // Create new review
      const review = await db.review.create({
        data: {
          rating,
          comment,
          userId,
          shopId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })
      return review
    }
  }
)
