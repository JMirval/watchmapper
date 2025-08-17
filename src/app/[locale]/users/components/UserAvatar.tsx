"use client"
import { User } from "@/db"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  user: Pick<User, "name" | "email"> & { avatar?: string | null }
  size?: "small" | "medium" | "large"
  className?: string
}

export function UserAvatar({ user, size = "medium", className = "" }: UserAvatarProps) {
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-20 w-20",
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={user.avatar || undefined} alt={user.name || "User avatar"} />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {getInitials(user.name, user.email)}
      </AvatarFallback>
    </Avatar>
  )
}
