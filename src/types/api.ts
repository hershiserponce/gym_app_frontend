export type PaginationMeta = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type ApiResponse<T> = {
  data: T
  meta?: {
    pagination?: PaginationMeta
  }
}

export type ApiCollectionResponse<T> = ApiResponse<T[]> & {
  meta: {
    pagination: PaginationMeta
  }
}

export type ApiSingleResponse<T> = {
  data: T
  meta?: Record<string, unknown>
}

export type StrapiData<T> = {
  id: number
  documentId: string
  attributes: T
}

export type StrapiImage = {
  id: number
  url: string
  alternativeText: string | null
  width: number
  height: number
  formats?: Record<
    string,
    {
      url: string
      width: number
      height: number
    }
  >
}

export type QueryParams = {
  pagination?: {
    page?: number
    pageSize?: number
  }
  sort?: string | string[]
  filters?: Record<string, unknown>
  populate?: string | string[]
  fields?: string[]
}
