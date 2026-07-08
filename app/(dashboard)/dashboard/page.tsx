"use client"

import { DollarSign, Users, CreditCard, ShoppingCart, TrendingUp } from "lucide-react"
import { StatsCard } from "@/src/features/dashboard/components/StatsCard"
import { RevenueChart } from "@/src/features/dashboard/components/RevenueChart"
import { RecentPayments } from "@/src/features/dashboard/components/RecentPayments"
import { RecentSales } from "@/src/features/dashboard/components/RecentSales"
import {
  useDashboardStats,
  useRevenueChart,
  useRecentPayments,
  useRecentSales,
} from "@/src/features/dashboard/hooks/useDashboard"
import { formatCurrency } from "@/src/utils/formatters"

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: revenueData, isLoading: chartLoading } = useRevenueChart()
  const { data: recentPayments, isLoading: paymentsLoading } = useRecentPayments()
  const { data: recentSales, isLoading: salesLoading } = useRecentSales()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del gimnasio
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ingresos del Día"
          value={stats ? formatCurrency(stats.dailyRevenue) : "$0"}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Ingresos por Membresías"
          value={stats ? formatCurrency(stats.membershipRevenue) : "$0"}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Ingresos por Ventas"
          value={stats ? formatCurrency(stats.salesRevenue) : "$0"}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Clientes Registrados Hoy"
          value={stats ? String(stats.newClientsToday) : "0"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={statsLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart data={revenueData || []} isLoading={chartLoading} />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <StatsCard
            title="Membresías Activas"
            value={stats ? String(stats.activeMemberships) : "0"}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            isLoading={statsLoading}
          />
          <RecentPayments data={recentPayments || []} isLoading={paymentsLoading} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentSales data={recentSales || []} isLoading={salesLoading} />
      </div>
    </div>
  )
}
