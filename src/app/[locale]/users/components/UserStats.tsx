"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserStatsProps {
  user: any
}

export function UserStats({ user }: UserStatsProps) {
  const stats = [
    {
      label: "Favorite Brands",
      value: user.favoriteBrands?.length || 0,
      icon: "🏷️",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Favorite Shops",
      value: user.favoriteShops?.length || 0,
      icon: "🏪",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      label: "Reviews",
      value: user.reviews?.length || 0,
      icon: "⭐",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    {
      label: "Member Since",
      value: new Date(user.createdAt).toLocaleDateString(),
      icon: "📅",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant="outline" className={stat.color}>
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
