import axios from "axios"
import { useAuthStore } from "@/src/store/auth-store"

export function getApiErrorMessage(error: unknown, fallback = "Error inesperado") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: { message?: string }; message?: string } | undefined
    return data?.error?.message || data?.message || error.message || fallback
  }
  return error instanceof Error ? error.message : fallback
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().jwt
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getApiErrorMessage(error)
    return Promise.reject(error)
  }
)

export default api
