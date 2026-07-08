import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type SaleData = {
  id: number
  receiptNumber: string | null
  total: number
  discount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  saleDate: string
  notes: string | null
}

export const salesService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/sales${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/sales/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/sales", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/sales/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/sales/${id}`)
    return response.data
  },
}
