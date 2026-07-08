import type { QueryParams } from "@/src/types/api"

export function buildQueryString(params?: QueryParams): string {
  if (!params) return ""

  const searchParams = new URLSearchParams()

  if (params.pagination) {
    if (params.pagination.page) {
      searchParams.set("pagination[page]", String(params.pagination.page))
    }
    if (params.pagination.pageSize) {
      searchParams.set("pagination[pageSize]", String(params.pagination.pageSize))
    }
  }

  if (params.sort) {
    params.sort.forEach((s, i) => {
      searchParams.set(`sort[${i}]`, s)
    })
  }

  if (params.filters) {
    searchParams.set("filters", JSON.stringify(params.filters))
  }

  if (params.populate) {
    if (Array.isArray(params.populate)) {
      params.populate.forEach((p, i) => {
        searchParams.set(`populate[${i}]`, p)
      })
    } else {
      searchParams.set("populate", params.populate)
    }
  }

  if (params.fields) {
    params.fields.forEach((f, i) => {
      searchParams.set(`fields[${i}]`, f)
    })
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}
