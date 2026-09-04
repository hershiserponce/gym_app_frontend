import type { User } from "@/src/store/auth-store"

export type LoginInput = {
  identifier: string
  password: string
}

export type RegisterInput = {
  username: string
  email: string
  password: string
  gymName: string
}

export type AuthResponse = {
  jwt: string
  user: User
}

export type ForgotPasswordInput = {
  email: string
}

export type ResetPasswordInput = {
  code: string
  password: string
  passwordConfirmation: string
}
