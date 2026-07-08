export type PaymentFormData = {
  client: number
  membership: number
  clientMembership?: number
  amount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  paymentDate: string
  notes: string
  receiptNumber?: string
}
