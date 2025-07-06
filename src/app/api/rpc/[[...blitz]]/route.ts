import { rpcAppHandler } from "@blitzjs/rpc"
import { withBlitzAuth } from "@/blitz-server"

export const { GET, HEAD, POST } = withBlitzAuth(rpcAppHandler())
