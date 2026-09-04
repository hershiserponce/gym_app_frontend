import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"
import { normalizeEntity, unwrapEntity } from "@/src/utils/strapi"
import type { EntityId } from "@/src/utils/strapi"

export type ProductData = {
  id: number
  documentId: string
  name: string
  description: string | null
  barcode: string | null
  cost: number
  price: number
  stock: number
  minStock: number
  supplier: string | null
  isActive: boolean
}

export const productsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/products${query}`)
    return { ...response.data, data: response.data.data.map(normalizeEntity) }
  },

  async getById(documentId: EntityId, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/products/${documentId}${query}`)
    return unwrapEntity(response.data)
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/products", { data })
    return unwrapEntity(response.data)
  },

  async update(documentId: EntityId, data: Record<string, unknown>) {
    const response = await api.put(`/products/${documentId}`, { data })
    return unwrapEntity(response.data)
  },

  async delete(documentId: EntityId) {
    const response = await api.delete(`/products/${documentId}`)
    return response.data
  },
}
