import api from "@/src/services/api"
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from "@/src/features/auth/types"
import type { User } from "@/src/store/auth-store"

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post("/auth/local", data)
    return response.data
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post("/auth/signup", data)
    return response.data
  },

  async me(): Promise<User> {
    const response = await api.get("/auth/me")
    return response.data
  },

  async updateProfile(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },
}
