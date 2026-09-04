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
        // Solo se cierra la sesión cuando el token fue rechazado.
        if (error && typeof error === "object" && "response" in error) {
          const response = (error as { response?: { status?: number } }).response
          if (response?.status === 401) logout()
        }
      }
    }

    verifyToken()
  }, [hasHydrated, jwt, logout, setUser])

  return <>{children}</>
}
