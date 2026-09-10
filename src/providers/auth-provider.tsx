"use client"

import { useEffect, type ReactNode } from "react"
import { useAuthStore } from "@/src/store/auth-store"
import api from "@/src/services/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const { jwt, hasHydrated, logout, setUser } = useAuthStore()

  useEffect(() => {
    if (!hasHydrated || !jwt) return

    const verifyToken = async () => {
      try {
        const response = await api.get("/auth/me")
        setUser(response.data)
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const response = (error as { response?: { status?: number } }).response
          if (response?.status === 401) logout()
        }
      }
    }

    verifyToken()
  }, [hasHydrated, jwt, logout, setUser])

  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
