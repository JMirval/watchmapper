import { Ctx } from "blitz"
import db from "@/db"

export default async function getUserReviews(_: null, ctx: Ctx) {
  if (!ctx.session.userId) return []
  
  const reviews = await db.review.findMany({
    where: { userId: ctx.session.userId },
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
  })

  return reviews
}
