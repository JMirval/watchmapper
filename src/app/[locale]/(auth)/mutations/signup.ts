import { resolver } from "@blitzjs/rpc"
import { Role } from "../../../../../types"
import { Signup } from "@/lib/validations"
import db from "@/db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

export default resolver.pipe(
  resolver.zod(Signup),
  async (input, ctx) => {
    const { email, password, name } = input
    const hashedPassword = await SecurePassword.hash(password)
    const user = await db.user.create({
      data: { email, hashedPassword, name },
      select: { id: true, name: true, email: true, role: true },
    })

    await ctx.session.$create({ userId: user.id, role: user.role as Role })
    return user
  }
)
