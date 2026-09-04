import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/src/features/auth/services"
import { useAuthStore } from "@/src/store/auth-store"
import type { RegisterInput } from "@/src/features/auth/types"

export function useRegister() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: async (data) => {
      setAuth(data.user, data.jwt)
      try {
        const user = await authService.me()
        setUser(user)
      } catch {
        // /auth/me falla silenciosamente; gymId queda del setAuth
      }
      toast.success("Registro exitoso")
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar")
    },
  })
}
