import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { UserPreferences } from "@/lib/validations"

export default resolver.pipe(
  resolver.zod(UserPreferences),
  resolver.authorize(),
  async (input, ctx) => {
    // Convert preferences to JSON string for storage
    const preferencesJson = JSON.stringify(input)

    const user = await db.user.update({
      where: { id: ctx.session.userId },
      data: {
        preferences: preferencesJson,
      },
      select: {
        id: true,
        preferences: true,
      },
    })

    return user
  }
)
