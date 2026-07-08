import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "@/src/features/dashboard/services"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000,
  })
}

export function useRevenueChart() {
  return useQuery({
    queryKey: ["dashboard", "revenue-chart"],
    queryFn: () => dashboardService.getRevenueChart(),
    refetchInterval: 60000,
  })
}

export function useRecentPayments() {
  return useQuery({
    queryKey: ["dashboard", "recent-payments"],
    queryFn: () => dashboardService.getRecentPayments(),
    refetchInterval: 30000,
  })
}

export function useRecentSales() {
  return useQuery({
    queryKey: ["dashboard", "recent-sales"],
    queryFn: () => dashboardService.getRecentSales(),
    refetchInterval: 30000,
  })
}
