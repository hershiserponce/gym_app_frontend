import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"
import { normalizeEntity, unwrapEntity } from "@/src/utils/strapi"
import type { EntityId } from "@/src/utils/strapi"

export type ProductCategoryData = {
  id: number
  documentId: string
  name: string
  description: string | null
  sortOrder: number | null
}

export const productCategoriesService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/product-categories${query}`)
    return { ...response.data, data: response.data.data.map(normalizeEntity) }
  },

  async getById(documentId: EntityId, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/product-categories/${documentId}${query}`)
    return unwrapEntity(response.data)
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/product-categories", { data })
    return unwrapEntity(response.data)
  },

  async update(documentId: EntityId, data: Record<string, unknown>) {
    const response = await api.put(`/product-categories/${documentId}`, { data })
    return unwrapEntity(response.data)
  },

  async delete(documentId: EntityId) {
    const response = await api.delete(`/product-categories/${documentId}`)
    return response.data
  },
}
