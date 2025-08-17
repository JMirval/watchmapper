"use client"
import { useRouter, useParams } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"
import signup from "../mutations/signup"
import { Signup } from "@/lib/validations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

type SignupFormProps = {
  onSuccess?: () => void
}

export function SignupForm(props: SignupFormProps) {
  const [signupMutation] = useMutation(signup)
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations("auth")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "", name: "" })
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    name?: string
    form?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate the form data
      const validatedData = Signup.parse(formData)

      // Submit the form
      await signupMutation(validatedData)
      router.refresh()
      router.push(`/${locale}`)

      toast.success(t("accountCreated"))
    } catch (error: any) {
      console.error("Signup error:", error)

      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        setErrors({ email: t("emailExists") })
        toast.error(t("emailExists"))
      } else if (error.name === "ZodError") {
        // Handle validation errors
        const fieldErrors: { email?: string; password?: string; name?: string } = {}
        error.errors.forEach((err: any) => {
          if (err.path[0] === "email") fieldErrors.email = err.message
          if (err.path[0] === "password") fieldErrors.password = err.message
          if (err.path[0] === "name") fieldErrors.name = err.message
        })
        setErrors(fieldErrors)
        toast.error(t("checkInput"))
      } else {
        setErrors({ form: t("unexpectedError") })
        toast.error(t("unexpectedError"))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field-specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
        <CardDescription>
          Join WatchMapper to discover the best watch shops and brands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.form}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder={t("fullName")}
                className="pl-10"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("email")}
                className="pl-10"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("password")}
                className="pl-10"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("creatingAccount") : t("createAccount")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
