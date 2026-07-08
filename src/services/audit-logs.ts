import api from "@/src/services/api"
import type { QueryParams } from "@/src/types/api"
import { buildQueryString } from "@/src/utils/query"

export const auditLogsService = {
  async list(params?: QueryParams) {
    const query = buildQueryString(params)
    const response = await api.get(`/audit-logs${query}`)
    return response.data
  },

  async create(data: Record<string, unknown>) {
    const response = await api.post("/audit-logs", { data })
    return response.data
  },
}
