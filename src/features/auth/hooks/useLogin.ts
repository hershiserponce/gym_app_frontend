import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/src/features/auth/services"
import { useAuthStore } from "@/src/store/auth-store"
import type { LoginInput } from "@/src/features/auth/types"

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: async (data) => {
      setAuth(data.user, data.jwt)
      try {
        const user = await authService.me()
        setUser(user)
      } catch {
        // /auth/me falla silenciosamente; gymId queda del setAuth
      }
      toast.success("Inicio de sesión exitoso")
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Credenciales inválidas")
    },
  })
}
