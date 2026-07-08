import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  id: number
  username: string
  email: string
  role: {
    id: number
    name: string
    type: string
  }
  blocked: boolean
  confirmed: boolean
}

type AuthState = {
  user: User | null
  jwt: string | null
  isAuthenticated: boolean
  setAuth: (user: User, jwt: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      isAuthenticated: false,
      setAuth: (user, jwt) => {
        localStorage.setItem("jwt", jwt)
        document.cookie = `auth-storage=${jwt}; path=/; max-age=604800; SameSite=Lax`
        set({ user, jwt, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem("jwt")
        document.cookie = "auth-storage=; path=/; max-age=0"
        set({ user: null, jwt: null, isAuthenticated: false })
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        jwt: state.jwt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
