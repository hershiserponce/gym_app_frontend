/** Unwraps a Strapi v5 entity and normalizes populated relation envelopes. */
export function unwrapEntity<T = Record<string, unknown>>(payload: unknown): T {
  const entity = isRecord(payload) && "data" in payload ? payload.data : payload
  return normalizeEntity(entity) as T
}

export function normalizeEntity<T>(entity: T): T {
  return normalizeRelations(entity) as T
}

export type EntityId = string | number

/** Strapi v5 uses documentId; numeric id is only for legacy records. */
export function getDocumentId(entity: unknown): EntityId | undefined {
  if (!isRecord(entity)) return undefined
  return typeof entity.documentId === "string" && entity.documentId
    ? entity.documentId
    : typeof entity.id === "number" || typeof entity.id === "string"
      ? entity.id
      : undefined
}

function normalizeRelations(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeRelations)
  if (!isRecord(value)) return value

  if ("data" in value && (Object.keys(value).length === 1 || "meta" in value)) {
    return normalizeRelations(value.data)
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, normalizeRelations(child)])
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
