"use client"

import { useEffect, type ReactNode } from "react"
import { useAuthStore } from "@/src/store/auth-store"
import api from "@/src/services/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const { jwt, logout } = useAuthStore()

  useEffect(() => {
    if (!jwt) return

    const verifyToken = async () => {
      try {
        await api.get("/users/me?populate=role")
      } catch {
        logout()
      }
    }

    verifyToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
