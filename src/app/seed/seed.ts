import db from "@/db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

async function seed() {
  console.log("🌱 Seeding database...")

  // Create or find a test user
  const hashedPassword = await SecurePassword.hash("password123")
  const user = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      hashedPassword,
      name: "Test User",
      role: "USER",
    },
  })

  console.log(`✅ Found/created test user: ${user.email}`)

  // Create brands sequentially
  const brands = []
  const brandData = [
    { name: "Rolex", type: "Luxury" },
    { name: "Omega", type: "Luxury" },
    { name: "Patek Philippe", type: "Ultra Luxury" },
    { name: "Seiko", type: "Mid-Range" },
    { name: "Tissot", type: "Mid-Range" },
    { name: "Citizen", type: "Affordable" },
  ]

  for (const brandInfo of brandData) {
    const brand = await db.brand.upsert({
      where: { name: brandInfo.name },
      update: {},
      create: brandInfo,
    })
    brands.push(brand)
  }

  console.log(`✅ Found/created ${brands.length} brands`)

  // Create shops sequentially
  const shops = []
  const shopData = [
    {
      name: "Timepiece Boutique",
      type: "reseller",
      latitude: 45.7602,
      longitude: 4.8357,
    },
    {
      name: "Luxury Watch Co.",
      type: "reseller",
      latitude: 45.7485,
      longitude: 4.8467,
    },
    {
      name: "Precision Timepieces",
      type: "repair",
      latitude: 45.7578,
      longitude: 4.832,
    },
    {
      name: "Elite Watches",
      type: "reseller",
      latitude: 45.7512,
      longitude: 4.8571,
    },
    {
      name: "Heritage Timepieces",
      type: "repair",
      latitude: 45.7505,
      longitude: 4.8500,
    },
    {
      name: "Modern Watch Gallery",
      type: "reseller",
      latitude: 45.7527,
      longitude: 4.8400,
    },
    {
      name: "Classic Timepieces",
      type: "repair",
      latitude: 45.7484,
      longitude: 4.8450,
    },
    {
      name: "Premium Watch Outlet",
      type: "reseller",
      latitude: 45.7505,
      longitude: 4.8350,
    },
  ]

  for (const shopInfo of shopData) {
    const shop = await db.shop.upsert({
      where: { name: shopInfo.name },
      update: {},
      create: shopInfo,
    })
    shops.push(shop)
  }

  console.log(`✅ Found/created ${shops.length} shops`)

  // Connect brands to shops
  const brandShopConnections = [
    // Timepiece Boutique - Rolex, Omega, Patek Philippe
    { shopId: shops[0].id, brandId: brands[0].id },
    { shopId: shops[0].id, brandId: brands[1].id },
    { shopId: shops[0].id, brandId: brands[2].id },
    
    // Luxury Watch Co. - Rolex, Omega
    { shopId: shops[1].id, brandId: brands[0].id },
    { shopId: shops[1].id, brandId: brands[1].id },
    
    // Precision Timepieces - Seiko, Tissot, Citizen
    { shopId: shops[2].id, brandId: brands[3].id },
    { shopId: shops[2].id, brandId: brands[4].id },
    { shopId: shops[2].id, brandId: brands[5].id },
    
    // Elite Watches - Rolex, Patek Philippe
    { shopId: shops[3].id, brandId: brands[0].id },
    { shopId: shops[3].id, brandId: brands[2].id },
    
    // Heritage Timepieces - Omega, Seiko, Tissot
    { shopId: shops[4].id, brandId: brands[1].id },
    { shopId: shops[4].id, brandId: brands[3].id },
    { shopId: shops[4].id, brandId: brands[4].id },
    
    // Modern Watch Gallery - All brands
    { shopId: shops[5].id, brandId: brands[0].id },
    { shopId: shops[5].id, brandId: brands[1].id },
    { shopId: shops[5].id, brandId: brands[2].id },
    { shopId: shops[5].id, brandId: brands[3].id },
    { shopId: shops[5].id, brandId: brands[4].id },
    { shopId: shops[5].id, brandId: brands[5].id },
    
    // Classic Timepieces - Seiko, Tissot, Citizen
    { shopId: shops[6].id, brandId: brands[3].id },
    { shopId: shops[6].id, brandId: brands[4].id },
    { shopId: shops[6].id, brandId: brands[5].id },
    
    // Premium Watch Outlet - Rolex, Omega, Patek Philippe
    { shopId: shops[7].id, brandId: brands[0].id },
    { shopId: shops[7].id, brandId: brands[1].id },
    { shopId: shops[7].id, brandId: brands[2].id },
  ]

  // Create brand-shop relationships
  for (const connection of brandShopConnections) {
    await db.shop.update({
      where: { id: connection.shopId },
      data: {
        brands: {
          connect: { id: connection.brandId },
        },
      },
    })
  }

  console.log(`✅ Connected brands to shops`)

  // Create some sample reviews
  const reviews = []
  const reviewData = [
    {
      rating: 5,
      comment: "Excellent service and a great selection of luxury timepieces. The staff was very knowledgeable and helpful.",
      shopId: shops[0].id,
    },
    {
      rating: 4,
      comment: "Good selection of watches, but a bit pricey. Staff was friendly and professional.",
      shopId: shops[1].id,
    },
    {
      rating: 5,
      comment: "Amazing collection of vintage and modern watches. Highly recommended for watch enthusiasts.",
      shopId: shops[2].id,
    },
  ]

  for (const reviewInfo of reviewData) {
    const review = await db.review.upsert({
      where: { userId_shopId: { userId: user.id, shopId: reviewInfo.shopId } },
      update: {},
      create: {
        ...reviewInfo,
        userId: user.id,
      },
    })
    reviews.push(review)
  }

  console.log(`✅ Found/created ${reviews.length} reviews`)

  console.log("🎉 Database seeded successfully!")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
