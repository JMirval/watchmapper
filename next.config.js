const { withBlitz } = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // your other config options
}

// Wrap with Blitz
const rawConfig = withBlitz(nextConfig)

// Remove invalid keys (Vercel-safe)
const { __esModule, default: _default, ...sanitizedConfig } = rawConfig

module.exports = sanitizedConfig
