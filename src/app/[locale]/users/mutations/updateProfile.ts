import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { UpdateProfile } from "@/lib/validations"

export default resolver.pipe(
  resolver.zod(UpdateProfile),
  resolver.authorize(),
  async (input, ctx) => {
    const user = await db.user.update({
      where: { id: ctx.session.userId },
      data: {
        name: input.name,
        bio: input.bio,
        location: input.location,
        phone: input.phone,
        avatar: input.avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        phone: true,
        avatar: true,
        role: true,
      },
    })

    return user
  }
)
