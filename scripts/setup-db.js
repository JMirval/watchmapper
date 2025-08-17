#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up WatchMapper database...\n")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env.local file...")

  const envContent = `# Database
# For development (SQLite)
POSTGRES_URL="file:./dev.db"

# For production (PostgreSQL)
# POSTGRES_URL="postgresql://username:password@host:port/database"

# Session Secret (required for authentication)
SESSION_SECRET_KEY="${require("crypto").randomBytes(32).toString("base64")}"

# Optional: Email configuration for password reset
# MAILER_EMAIL_FROM="noreply@yourdomain.com"
# MAILER_SMTP_HOST="smtp.yourdomain.com"
# MAILER_SMTP_PORT="587"
# MAILER_SMTP_USER="your-email@yourdomain.com"
# MAILER_SMTP_PASSWORD="your-email-password"
`

  fs.writeFileSync(envPath, envContent)
  console.log("✅ .env.local created with default configuration")
} else {
  console.log("✅ .env.local already exists")
}

// Generate Prisma client
console.log("\n🔧 Generating Prisma client...")
try {
  execSync("pnpm db:generate", { stdio: "inherit" })
  console.log("✅ Prisma client generated")
} catch (error) {
  console.error("❌ Failed to generate Prisma client:", error.message)
  process.exit(1)
}

// Run database migrations
console.log("\n🗄️ Running database migrations...")
try {
  execSync("pnpm db:migrate", { stdio: "inherit" })
  console.log("✅ Database migrations completed")
} catch (error) {
  console.error("❌ Failed to run migrations:", error.message)
  console.log("\n💡 If this is your first setup, try running: pnpm db:push")
  process.exit(1)
}

console.log("\n🎉 Database setup completed successfully!")
console.log("\n📚 Next steps:")
console.log("1. Start the development server: pnpm dev")
console.log("2. Open Prisma Studio: pnpm db:studio")
console.log("3. For production deployment, see DEPLOYMENT.md")
