import { resolver } from "@blitzjs/rpc"
import { Role } from "../../../../../types"
import { Login } from "@/lib/validations"
import db from "@/db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

export default resolver.pipe(
  resolver.zod(Login),
  async (input, ctx) => {
    // Find the user by email
    const user = await db.user.findFirst({ where: { email: input.email.toLowerCase() } })
    if (!user) throw new Error("No user found")

    // Verify the password
    const result = await SecurePassword.verify(user.hashedPassword, input.password)
    if (result === SecurePassword.VALID_NEEDS_REHASH) {
      // Upgrade password with a more secure hash
      const improvedHash = await SecurePassword.hash(input.password)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
    } else if (result !== SecurePassword.VALID) {
      throw new Error("Invalid password")
    }

    // Create the session
    await ctx.session.$create({ userId: user.id, role: user.role as Role })
    
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  }
)
