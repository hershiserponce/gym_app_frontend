export type PosProduct = {
  id: number
  name: string
  price: number
  stock: number
  barcode: string | null
}

export type SalePayload = {
  client?: number
  items: Array<{
    product: number
    quantity: number
    unitPrice: number
    subtotal: number
  }>
  total: number
  discount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  notes: string
}
