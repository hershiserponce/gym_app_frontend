import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/src/features/auth/services"
import { useAuthStore } from "@/src/store/auth-store"
import type { LoginInput } from "@/src/features/auth/types"

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: async (data) => {
      setAuth(data.user, data.jwt)
      toast.success("Inicio de sesión exitoso")
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Credenciales inválidas")
    },
  })
}
