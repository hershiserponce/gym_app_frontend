import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/src/features/auth/services"
import { useAuthStore } from "@/src/store/auth-store"
import type { RegisterInput } from "@/src/features/auth/types"

export function useRegister() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.jwt)
      toast.success("Registro exitoso")
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar")
    },
  })
}
