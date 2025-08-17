import { enhancePrisma } from "blitz"
import { PrismaClient } from "../src/app/generated/prisma-client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

// Configure Prisma for different environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const db =
  globalForPrisma.prisma ??
  new EnhancedPrisma({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export * from "../src/app/generated/prisma-client"
export default db
