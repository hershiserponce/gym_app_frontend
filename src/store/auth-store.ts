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
  gym?: {
    id: number
    documentId?: string
    name: string
    slug: string
  }
}

type AuthState = {
  user: User | null
  gymId: number | null
  jwt: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setAuth: (user: User, jwt: string) => void
  logout: () => void
  setUser: (user: User) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

function setAuthCookie(jwt: string) {
  document.cookie = `auth-storage=${jwt}; path=/; max-age=604800; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = "auth-storage=; path=/; max-age=0; SameSite=Lax"
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      gymId: null,
      jwt: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, jwt) => {
        setAuthCookie(jwt)
        set({ user, gymId: (typeof user.gym === "object" ? user.gym?.id : user.gym) ?? null, jwt, isAuthenticated: true })
      },
      logout: () => {
        clearAuthCookie()
        set({ user: null, gymId: null, jwt: null, isAuthenticated: false })
      },
      setUser: (user) =>
        set((state) => {
          const resolvedUser = user.gym ? user : { ...user, gym: state.user?.gym }
          const gymId = (typeof resolvedUser.gym === "object" ? resolvedUser.gym?.id : resolvedUser.gym) ?? null
          return { user: resolvedUser, gymId }
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        gymId: state.user?.gym
          ? (typeof state.user.gym === "object" ? state.user.gym.id : state.user.gym)
          : null,
        jwt: state.jwt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error rehydrating auth state:", error)
        }
        state?.setHasHydrated(true)
        if (state?.jwt) setAuthCookie(state.jwt)
      },
    }
  )
)
