import { useAuthStore } from "@/src/store/auth-store"

export function useTenantId() {
  return useAuthStore((state) => state.gymId)
}
