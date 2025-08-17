"use client"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useRouter, useParams } from "next/navigation"
import { ProfileForm } from "../components/ProfileForm"
import { useTranslations } from "next-intl"

export default function ProfilePage() {
  const user = useCurrentUser()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations("profile")

  if (!user) {
    router.push(`/${locale}/login`)
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
