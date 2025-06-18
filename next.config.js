const { withBlitz } = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // your other valid options here
}

const blitzConfig = withBlitz(nextConfig)

// Recursively remove `target` and other invalid keys
function stripInvalidKeys(obj) {
  if (typeof obj !== "object" || obj === null) return obj

  const cleaned = {}
  for (const key of Object.keys(obj)) {
    if (key === "target" || key === "__esModule" || key === "default") continue
    cleaned[key] = stripInvalidKeys(obj[key])
  }
  return cleaned
}

module.exports = stripInvalidKeys(blitzConfig)
