import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { RecentPayment } from "@/src/features/dashboard/types"
import { formatDate } from "@/src/utils/formatters"
import { useCurrency } from "@/src/hooks/useCurrency"

type RecentPaymentsProps = {
  data: RecentPayment[]
  isLoading?: boolean
}

const paymentMethodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
}

export function RecentPayments({ data, isLoading }: RecentPaymentsProps) {
  const { formatValue } = useCurrency()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Últimos Pagos</CardTitle>
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
            No hay pagos recientes
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {payment.clientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.membershipName} • {formatDate(payment.paymentDate, "short")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {formatValue(payment.amount)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {paymentMethodLabels[payment.paymentMethod] || payment.paymentMethod}
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
