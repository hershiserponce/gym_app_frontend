import type { QueryParams } from "@/src/types/api"

function appendQueryValue(
  searchParams: URLSearchParams,
  key: string,
  value: unknown
) {
  if (value === undefined) return

  if (Array.isArray(value)) {
    value.forEach((item, index) => appendQueryValue(searchParams, `${key}[${index}]`, item))
    return
  }

  if (value !== null && typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendQueryValue(searchParams, `${key}[${childKey}]`, childValue)
    })
    return
  }

  searchParams.append(key, String(value))
}

export function buildQueryString(params?: QueryParams): string {
  if (!params) return ""

  const searchParams = new URLSearchParams()

  if (params.pagination) {
    appendQueryValue(searchParams, "pagination", params.pagination)
  }

  if (params.sort) {
    appendQueryValue(searchParams, "sort", params.sort)
  }

  if (params.filters && Object.keys(params.filters).length > 0) {
    appendQueryValue(searchParams, "filters", params.filters)
  }

  if (params.populate) {
    appendQueryValue(searchParams, "populate", params.populate)
  }

  if (params.fields) {
    appendQueryValue(searchParams, "fields", params.fields)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}
