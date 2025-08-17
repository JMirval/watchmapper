import { resolver } from "@blitzjs/rpc"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  return await ctx.session.$revokeAll()
})
