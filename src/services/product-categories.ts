import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type ProductCategoryData = {
  id: number
  name: string
  description: string | null
  sortOrder: number | null
}

export const productCategoriesService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/product-categories${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/product-categories/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/product-categories", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/product-categories/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/product-categories/${id}`)
    return response.data
  },
}
