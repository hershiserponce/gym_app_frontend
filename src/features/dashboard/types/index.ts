export type DashboardStats = {
  dailyRevenue: number
  membershipRevenue: number
  salesRevenue: number
  newClientsToday: number
  activeMemberships: number
  lowStockProducts: number
}

export type RevenuePoint = {
  date: string
  memberships: number
  sales: number
  total: number
}

export type RecentPayment = {
  id: number
  clientName: string
  membershipName: string
  amount: number
  paymentMethod: string
  paymentDate: string
}

export type RecentSale = {
  id: number
  receiptNumber: string
  clientName: string
  total: number
  paymentMethod: string
  saleDate: string
}
