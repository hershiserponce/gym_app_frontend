import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type ClientMembershipData = {
  id: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "frozen" | "cancelled"
  autoRenew: boolean
  frozenDays: number
  notes: string | null
}

export const clientMembershipsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/client-memberships${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/client-memberships/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/client-memberships", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/client-memberships/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/client-memberships/${id}`)
    return response.data
  },
}
