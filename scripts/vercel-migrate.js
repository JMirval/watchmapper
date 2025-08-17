#!/usr/bin/env node

const { execSync } = require("child_process")

console.log("🚀 Running database migrations for Vercel deployment...\n")

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  console.log("Please set the DATABASE_URL environment variable in your Vercel project settings")
  process.exit(1)
}

// Check if SESSION_SECRET_KEY is set
if (!process.env.SESSION_SECRET_KEY) {
  console.error("❌ SESSION_SECRET_KEY environment variable is not set")
  console.log(
    "Please set the SESSION_SECRET_KEY environment variable in your Vercel project settings"
  )
  process.exit(1)
}

console.log("✅ Environment variables are configured")

// Generate Prisma client
console.log("\n🔧 Generating Prisma client...")
try {
  execSync("prisma generate", { stdio: "inherit" })
  console.log("✅ Prisma client generated")
} catch (error) {
  console.error("❌ Failed to generate Prisma client:", error.message)
  process.exit(1)
}

// Run database migrations
console.log("\n🗄️ Running database migrations...")
try {
  execSync("prisma migrate deploy", { stdio: "inherit" })
  console.log("✅ Database migrations completed successfully")
} catch (error) {
  console.error("❌ Failed to run migrations:", error.message)
  console.log("\n💡 Common solutions:")
  console.log("1. Check that your DATABASE_URL is correct")
  console.log("2. Ensure your database is accessible from Vercel")
  console.log("3. Verify you have the correct permissions on your database")
  process.exit(1)
}

console.log("\n🎉 Vercel deployment database setup completed!")
