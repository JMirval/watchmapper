"use client"
import { useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useRouter, useParams } from "next/navigation"
import { UserReviews } from "../components/UserReviews"
import { useTranslations } from "next-intl"
import getUserReviews from "../queries/getUserReviews"

export default function ReviewsPage() {
  const user = useCurrentUser()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations("reviews")
  const [reviews] = useQuery(getUserReviews, null)

  if (!user) {
    router.push(`/${locale}/login`)
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <UserReviews reviews={reviews || []} />
      </div>
    </div>
  )
}
