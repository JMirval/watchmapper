import {z} from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const Signup = z.object({
  email,
  password,
  name: z.string().min(2).max(100).optional(),
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})

// New validation schemas for user profile management
export const UpdateProfile = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().url().optional(),
})

export const UserPreferences = z.object({
  favoriteBrands: z.array(z.number()).optional(),
  favoriteShops: z.array(z.number()).optional(),
  notifications: z.object({
    email: z.boolean().default(true),
    newShops: z.boolean().default(true),
    newBrands: z.boolean().default(true),
  }).optional(),
})

export const Review = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
  shopId: z.number(),
})
