export type ProductFormData = {
  name: string
  description: string
  category?: string | null
  barcode: string
  cost: number
  price: number
  stock: number
  minStock: number
  supplier: string
  isActive: boolean
  image?: File | null
}

export type CategoryFormData = {
  name: string
  description: string
  sortOrder: number
}

export type MovementFormData = {
  product: string
  type: "in" | "out" | "adjustment"
  quantity: number
  referenceType: "purchase" | "sale" | "adjustment" | "expiration"
  referenceId: string
  unitCost: number
  notes: string
}
