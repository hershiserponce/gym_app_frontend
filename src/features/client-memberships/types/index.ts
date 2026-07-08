export type ClientMembershipFormData = {
  client: number
  membership: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "frozen" | "cancelled"
  autoRenew: boolean
  frozenDays: number
  notes: string
}

export type ClientMembershipFilters = {
  status?: "active" | "expired" | "frozen" | "cancelled" | "all"
  clientName?: string
}
