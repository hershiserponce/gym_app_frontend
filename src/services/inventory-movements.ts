import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"
import { normalizeEntity, unwrapEntity } from "@/src/utils/strapi"
import type { EntityId } from "@/src/utils/strapi"

export type InventoryMovementData = {
  id: number
  documentId: string
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
    return { ...response.data, data: response.data.data.map(normalizeEntity) }
  },

  async getById(documentId: EntityId, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/inventory-movements/${documentId}${query}`)
    return unwrapEntity(response.data)
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/inventory-movements", { data })
    return unwrapEntity(response.data)
  },

  async update(documentId: EntityId, data: Record<string, unknown>) {
    const response = await api.put(`/inventory-movements/${documentId}`, { data })
    return unwrapEntity(response.data)
  },

  async delete(documentId: EntityId) {
    const response = await api.delete(`/inventory-movements/${documentId}`)
    return response.data
  },
}
