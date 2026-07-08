import api from "@/src/services/api"
import type {
  DashboardStats,
  RevenuePoint,
  RecentPayment,
  RecentSale,
} from "@/src/features/dashboard/types"

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get("/dashboard/stats")
    return response.data
  },

  async getRevenueChart(): Promise<RevenuePoint[]> {
    const response = await api.get("/dashboard/revenue-chart")
    return response.data
  },

  async getRecentPayments(): Promise<RecentPayment[]> {
    const paymentsResponse = await api.get("/payments", {
      params: {
        populate: "client,membership",
        "sort[0]": "paymentDate:desc",
        "pagination[pageSize]": 5,
      },
    })
    return paymentsResponse.data.data.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      clientName: ((item as Record<string, unknown>).client as Record<string, unknown>)?.fullName as string || "N/A",
      membershipName: ((item as Record<string, unknown>).membership as Record<string, unknown>)?.name as string || "N/A",
      amount: (item as Record<string, unknown>).amount as number,
      paymentMethod: (item as Record<string, unknown>).paymentMethod as string,
      paymentDate: (item as Record<string, unknown>).paymentDate as string,
    }))
  },

  async getRecentSales(): Promise<RecentSale[]> {
    const response = await api.get("/sales", {
      params: {
        populate: "client",
        "sort[0]": "saleDate:desc",
        "pagination[pageSize]": 5,
      },
    })
    return response.data.data.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      receiptNumber: (item as Record<string, unknown>).receiptNumber as string,
      clientName: ((item as Record<string, unknown>).client as Record<string, unknown>)?.fullName as string || "Mostrador",
      total: (item as Record<string, unknown>).total as number,
      paymentMethod: (item as Record<string, unknown>).paymentMethod as string,
      saleDate: (item as Record<string, unknown>).saleDate as string,
    }))
  },
}
