import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { RevenuePoint } from "@/src/features/dashboard/types"

type RevenueChartProps = {
  data: RevenuePoint[]
  isLoading?: boolean
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ingresos (Últimos 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ingresos (Últimos 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.total), 1)
  const barWidth = Math.max(20, Math.min(60, 600 / data.length - 8))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ingresos (Últimos 7 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-[200px]">
          {data.map((point, i) => {
            const height = (point.total / maxValue) * 180
            return (
              <div
                key={i}
                className="flex flex-col items-center flex-1"
                title={`${point.date}: $${point.total}`}
              >
                <div
                  className="w-full bg-primary rounded-t transition-all duration-300"
                  style={{
                    height: `${Math.max(4, height)}px`,
                    maxWidth: `${barWidth}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground mt-1 truncate w-full text-center">
                  {point.date.slice(5)}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
