import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type ProductData = {
  id: number
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
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/products/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/products", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/products/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}
