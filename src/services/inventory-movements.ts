import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export type InventoryMovementData = {
  id: number
  type: "in" | "out" | "adjustment"
  quantity: number
  referenceType: "purchase" | "sale" | "adjustment" | "expiration" | null
  referenceId: string | null
  unitCost: number | null
  notes: string | null
  movementDate: string
}

export const inventoryMovementsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/inventory-movements${query}`)
    return response.data
  },

  async getById(id: number, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/inventory-movements/${id}${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/inventory-movements", { data })
    return response.data
  },

  async update(id: number, data: Record<string, unknown>) {
    const response = await api.put(`/inventory-movements/${id}`, { data })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/inventory-movements/${id}`)
    return response.data
  },
}
