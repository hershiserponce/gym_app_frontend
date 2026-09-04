import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "@/src/features/dashboard/services"
import { useTenantId } from "@/src/hooks/useTenantId"

export function useDashboardStats() {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["dashboard", gymId, "stats"],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000,
    enabled: gymId !== null,
  })
}

export function useRevenueChart() {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["dashboard", gymId, "revenue-chart"],
    queryFn: () => dashboardService.getRevenueChart(),
    refetchInterval: 60000,
    enabled: gymId !== null,
  })
}

export function useRecentPayments() {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["dashboard", gymId, "recent-payments"],
    queryFn: () => dashboardService.getRecentPayments(),
    refetchInterval: 30000,
    enabled: gymId !== null,
  })
}

export function useRecentSales() {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["dashboard", gymId, "recent-sales"],
    queryFn: () => dashboardService.getRecentSales(),
    refetchInterval: 30000,
    enabled: gymId !== null,
  })
}
