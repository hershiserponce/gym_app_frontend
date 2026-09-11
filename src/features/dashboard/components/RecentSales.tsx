import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { RecentSale } from "@/src/features/dashboard/types"
import { formatDate } from "@/src/utils/formatters"
import { useCurrency } from "@/src/hooks/useCurrency"

type RecentSalesProps = {
  data: RecentSale[]
  isLoading?: boolean
}

const paymentMethodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
}

export function RecentSales({ data, isLoading }: RecentSalesProps) {
  const { formatValue } = useCurrency()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Últimas Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay ventas recientes
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.clientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sale.receiptNumber} • {formatDate(sale.saleDate, "short")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {formatValue(sale.total)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {paymentMethodLabels[sale.paymentMethod] || sale.paymentMethod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
