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

    // Build where clause
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
      where.brands =  {
        some: {
          id: brandId,
        },
      }
    }

    // Calculate distance if coordinates provided
    let distanceSelect = ""
    if (userLat && userLng) {
      distanceSelect = `
        , (
          6371 * acos(
            cos(radians(${userLat})) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${userLng})) + 
            sin(radians(${userLat})) * sin(radians(latitude))
          )
        ) as distance
      `
    }

    // Build order by clause
    let orderBy: any = {}
    if (sortBy === "distance" && userLat && userLng) {
      orderBy.distance = sortOrder
    } else {
      orderBy[sortBy] = sortOrder
    }

    // Get shops with reviews and brands
    const shops = await db.$queryRaw`
      SELECT 
        s.id,
        s.name,
        s.type,
        s.latitude,
        s.longitude,
        s.createdAt,
        s.updatedAt,
        COUNT(DISTINCT r.id) as reviewCount,
        AVG(r.rating) as averageRating
        ${distanceSelect}
      FROM Shop s
      LEFT JOIN Review r ON s.id = r.shopId
      WHERE 1=1
        ${search ? `AND (s.name LIKE '%${search}%' OR s.type LIKE '%${search}%')` : ""}
        ${type ? `AND s.type = '${type}'` : ""}
        ${brandId ? `AND EXISTS (SELECT 1 FROM _BrandToShop WHERE B = s.id AND A = ${brandId})` : ""}
        ${minRating ? `AND (SELECT AVG(rating) FROM Review WHERE shopId = s.id) >= ${minRating}` : ""}
        ${maxDistance && userLat && userLng ? `AND (
          6371 * acos(
            cos(radians(${userLat})) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${userLng})) + 
            sin(radians(${userLat})) * sin(radians(latitude))
          )
        ) <= ${maxDistance}` : ""}
      GROUP BY s.id
      ORDER BY ${sortBy === "distance" && userLat && userLng ? "distance" : `s.${sortBy}`} ${sortOrder.toUpperCase()}
      LIMIT ${limit} OFFSET ${skip}
    `

    // Get total count for pagination
    const totalCount = await db.shop.count({ where })

    // Get brands for each shop
    const shopsWithBrands = await Promise.all(
      (shops as any[]).map(async (shop) => {
        const brands = await db.brand.findMany({
          where: {
            shops: {
              some: {
                id: shop.id,
              },
            },
          },
          select: {
            id: true,
            name: true,
            type: true,
          },
        })

        return {
          ...shop,
          brands,
          averageRating: shop.averageRating ? parseFloat(shop.averageRating) : 0,
          reviewCount: parseInt(shop.reviewCount),
        }
      })
    )

    return {
      shops: shopsWithBrands,
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
