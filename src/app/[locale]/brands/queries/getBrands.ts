import { resolver } from "@blitzjs/rpc"
import db from "@/db"
import { z } from "zod"

const GetBrands = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
})

export default resolver.pipe(
  resolver.zod(GetBrands),
  async (input) => {
    const { search, type, limit } = input

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ]
    }

    if (type) {
      where.type = type
    }

    const brands = await db.brand.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        _count: {
          select: {
            shops: true,
            favoriteUsers: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: limit,
    })

    return brands.map((brand) => ({
      ...brand,
      shopCount: brand._count.shops,
      favoriteCount: brand._count.favoriteUsers,
    }))
  }
)
