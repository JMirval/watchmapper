"use client"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"
import { LabeledTextField } from "@/components/LabeledTextField"
import { Form, FORM_ERROR } from "@/components/Form"
import login from "../mutations/login"
import type { Route } from "next"
import { Login } from "@/lib/validations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, LogIn } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm(props: LoginFormProps) {
  const [loginMutation] = useMutation(login)
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as string
  const next = searchParams.get("next")
  const t = useTranslations("auth")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate the form data
      const validatedData = Login.parse(formData)

      // Submit the form
      await loginMutation(validatedData)
      router.refresh()

      if (next) {
        router.push(next as Route)
      } else {
        router.push(`/${locale}`)
      }

      toast.success(t("loginSuccess"))
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.name === "AuthenticationError") {
        setErrors({ form: t("invalidCredentials") })
        toast.error(t("invalidCredentials"))
      } else if (error.name === "ZodError") {
        // Handle validation errors
        const fieldErrors: { email?: string; password?: string } = {}
        error.errors.forEach((err: any) => {
          if (err.path[0] === "email") fieldErrors.email = err.message
          if (err.path[0] === "password") fieldErrors.password = err.message
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
        <CardTitle className="text-2xl">{t("welcomeBack")}</CardTitle>
        <CardDescription>{t("signInToAccount")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.form}
            </div>
          )}

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
            <LogIn className="mr-2 h-4 w-4" />
            {isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
