"use client"
import { useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import getUserFavorites from "../queries/getUserFavorites"
import { UserFavorites } from "../components/UserFavorites"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"

function FavoritesContent() {
  const [favorites] = useQuery(getUserFavorites, {})
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">Your favorite watch brands and shops</p>
        </div>

        <UserFavorites user={favorites} />
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavoritesContent />
    </Suspense>
  )
}
