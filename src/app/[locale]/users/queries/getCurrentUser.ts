import { Ctx } from "blitz"
import db from "@/db"

export default async function getCurrentUser(_: null, ctx: Ctx) {
  if (!ctx.session.userId) return null
  
  try {
    const user = await db.user.findFirst({
      where: { id: ctx.session.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return user
  } catch (error) {
    console.error("Database error in getCurrentUser:", error)
    // Return null instead of throwing error to prevent 500
    return null
  }
}
