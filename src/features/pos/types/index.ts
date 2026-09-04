export type PosProduct = {
  id: number
  documentId: string
  name: string
  price: number
  stock: number
  barcode: string | null
}

export type SalePayload = {
  client?: string
  items: Array<{
    product: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>
  total: number
  discount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  notes: string
}
