import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type PaymentData = {
  id: number
  amount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  paymentDate: string
  notes: string | null
  receiptNumber: string | null
}

export const paymentsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/payments${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/payments/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/payments", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/payments/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/payments/${id}`)
    return response.data
  },
}
