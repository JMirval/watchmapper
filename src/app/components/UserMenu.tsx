"use client"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useRouter, useParams } from "next/navigation"
import { useCurrentUser } from "../[locale]/users/hooks/useCurrentUser"
import { UserAvatar } from "../[locale]/users/components/UserAvatar"
import logout from "../[locale]/(auth)/mutations/logout"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, User, Heart, Star, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"

interface UserMenuProps {
  variant?: "dropdown" | "mobile"
}

export function UserMenu({ variant = "dropdown" }: UserMenuProps) {
  const user = useCurrentUser()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const [logoutMutation] = useMutation(logout)
  const t = useTranslations("userMenu")

  if (!user) {
    return (
      <div className={`flex ${variant === "mobile" ? "flex-col space-y-2" : "space-x-4"}`}>
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/login`)}
          className={variant === "mobile" ? "w-full" : ""}
        >
          {t("login")}
        </Button>
        <Button
          onClick={() => router.push(`/${locale}/signup`)}
          className={variant === "mobile" ? "w-full" : ""}
        >
          {t("signup")}
        </Button>
      </div>
    )
  }

  if (variant === "mobile") {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <UserAvatar user={user} size="small" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
            <p className="text-xs text-gray-500">{t("myAccount")}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3"
            onClick={() => router.push(`/${locale}/users/profile`)}
          >
            <User className="mr-3 h-4 w-4" />
            {t("profile")}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3"
            onClick={() => router.push(`/${locale}/users/favorites`)}
          >
            <Heart className="mr-3 h-4 w-4" />
            {t("myFavorites")}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3"
            onClick={() => router.push(`/${locale}/users/reviews`)}
          >
            <Star className="mr-3 h-4 w-4" />
            {t("myReviews")}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={async () => {
              await logoutMutation()
              router.push(`/${locale}`)
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            {t("logout")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <UserAvatar user={user} size="small" />
          <span className="text-sm font-medium">{user.name || user.email}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/${locale}/users/profile`)}>
          <User className="mr-2 h-4 w-4" />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${locale}/users/favorites`)}>
          <Heart className="mr-2 h-4 w-4" />
          {t("myFavorites")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${locale}/users/reviews`)}>
          <Star className="mr-2 h-4 w-4" />
          {t("myReviews")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logoutMutation()
            router.push(`/${locale}`)
          }}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
