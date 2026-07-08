import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type MembershipData = {
  id: number
  name: string
  description: string | null
  price: number
  duration: number
  benefits: string | null
  color: string | null
  sortOrder: number | null
  isActive: boolean
}

export const membershipsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/memberships${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/memberships/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/memberships", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/memberships/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/memberships/${id}`)
    return response.data
  },
}
