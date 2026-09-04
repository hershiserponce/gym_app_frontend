export type PaymentFormData = {
  client: string
  membership: string
  clientMembership?: string
  amount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  paymentDate: string
  notes: string
  receiptNumber?: string
}
