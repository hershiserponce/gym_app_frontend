import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"
import { normalizeEntity, unwrapEntity } from "@/src/utils/strapi"
import type { EntityId } from "@/src/utils/strapi"

export type MembershipData = {
  id: number
  documentId: string
  name: string
  description: string | null
  price: number
  duration: number
  benefits: string | null
  color: string | null
  sortOrder: number | null
  isActive: boolean
}

export const membershipsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/memberships${query}`)
    return { ...response.data, data: response.data.data.map(normalizeEntity) }
  },

  async getById(documentId: EntityId, params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/memberships/${documentId}${query}`)
    return unwrapEntity(response.data)
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/memberships", { data })
    return unwrapEntity(response.data)
  },

  async update(documentId: EntityId, data: Record<string, unknown>) {
    const response = await api.put(`/memberships/${documentId}`, { data })
    return unwrapEntity(response.data)
  },

  async delete(documentId: EntityId) {
    const response = await api.delete(`/memberships/${documentId}`)
    return response.data
  },
}
