import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type ClientData = {
  id: number
  fullName: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: "male" | "female" | "other" | null
  photo: unknown | null
  notes: string | null
  status: "active" | "inactive"
  registrationDate: string
  address: string | null
}

export const clientsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/clients${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/clients/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/clients", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/clients/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  },
}
