export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api"

export const APP_NAME = "GymApp"

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
} as const

export const GENDER_OPTIONS = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
  { value: "other", label: "Otro" },
] as const

export const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
] as const

export const MEMBERSHIP_STATUS_OPTIONS = [
  { value: "active", label: "Activa" },
  { value: "expired", label: "Vencida" },
  { value: "frozen", label: "Congelada" },
  { value: "cancelled", label: "Cancelada" },
] as const

export const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
  { value: "other", label: "Otro" },
] as const

export const INVENTORY_MOVEMENT_TYPE_OPTIONS = [
  { value: "in", label: "Entrada" },
  { value: "out", label: "Salida" },
  { value: "adjustment", label: "Ajuste" },
] as const

export const INVENTORY_REFERENCE_TYPE_OPTIONS = [
  { value: "purchase", label: "Compra" },
  { value: "sale", label: "Venta" },
  { value: "adjustment", label: "Ajuste" },
  { value: "expiration", label: "Vencimiento" },
] as const
