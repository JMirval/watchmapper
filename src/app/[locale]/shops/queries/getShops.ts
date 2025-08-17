import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { z } from "zod"

const GetShops = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  brandId: z.number().optional(),
  minRating: z.number().min(1).max(5).optional(),
  maxDistance: z.number().optional(), // in kilometers
  userLat: z.number().optional(),
  userLng: z.number().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  sortBy: z.enum(["name", "rating", "distance", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export default resolver.pipe(
  resolver.zod(GetShops),
  async (input) => {
    const {
      search,
      type,
      brandId,
      minRating,
      maxDistance,
      userLat,
      userLng,
      page,
      limit,
      sortBy,
      sortOrder,
    } = input

    const skip = (page - 1) * limit

    // Build where clause for Prisma query
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
        {
          brands: {
            some: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ]
    }

    if (type) {
      where.type = type
    }

    if (brandId) {
      where.brands = {
        some: {
          id: brandId,
        },
      }
    }

    // Use Prisma's built-in query instead of raw SQL for better safety and maintainability
    const shops = await db.shop.findMany({
      where,
      include: {
        reviews: true,
        brands: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    })

    // Process shops to add computed fields
    const processedShops = shops.map((shop) => {
      const reviewCount = shop.reviews.length
      const averageRating = reviewCount > 0 
        ? shop.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
        : 0

      let distance = null
      if (userLat && userLng) {
        // Calculate distance using Haversine formula
        const R = 6371 // Earth's radius in kilometers
        const dLat = (shop.latitude - userLat) * Math.PI / 180
        const dLng = (shop.longitude - userLng) * Math.PI / 180
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(shop.latitude * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        distance = R * c
      }

      return {
        ...shop,
        reviewCount,
        averageRating,
        distance,
      }
    })

    // Filter by distance if specified
    let filteredShops = processedShops
    if (maxDistance && userLat && userLng) {
      filteredShops = processedShops.filter(shop => shop.distance && shop.distance <= maxDistance)
    }

    // Filter by minimum rating if specified
    if (minRating) {
      filteredShops = filteredShops.filter(shop => shop.averageRating >= minRating)
    }

    // Sort by distance if requested and we have user location
    if (sortBy === "distance" && userLat && userLng) {
      filteredShops.sort((a, b) => {
        if (!a.distance && !b.distance) return 0
        if (!a.distance) return 1
        if (!b.distance) return -1
        return sortOrder === "asc" ? a.distance - b.distance : b.distance - a.distance
      })
    }

    // Get total count for pagination
    const totalCount = await db.shop.count({ where })

    return {
      shops: filteredShops,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    }
  }
)
