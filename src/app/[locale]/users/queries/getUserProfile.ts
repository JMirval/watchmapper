import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { z } from "zod"

const GetUserProfile = z.object({
  userId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(GetUserProfile),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = input.userId || ctx.session.userId

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        preferences: true,
        favoriteBrands: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
        favoriteShops: {
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
        },
        reviews: {
          include: {
            shop: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Parse preferences JSON string
    const preferences = user.preferences ? JSON.parse(user.preferences) : null

    return {
      ...user,
      preferences,
    }
  }
)
