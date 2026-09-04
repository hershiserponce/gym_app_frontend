import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"
import { normalizeEntity, unwrapEntity } from "@/src/utils/strapi"
import type { EntityId } from "@/src/utils/strapi"

export type SaleData = {
  id: number
  documentId: string
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
    return { ...response.data, data: response.data.data.map(normalizeEntity) }
  },

  async getById(documentId: EntityId, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/sales/${documentId}${query}`)
    return unwrapEntity(response.data)
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/sales", { data })
    return unwrapEntity(response.data)
  },

  async update(documentId: EntityId, data: Record<string, unknown>) {
    const response = await api.put(`/sales/${documentId}`, { data })
    return unwrapEntity(response.data)
  },

  async delete(documentId: EntityId) {
    const response = await api.delete(`/sales/${documentId}`)
    return response.data
  },
}
