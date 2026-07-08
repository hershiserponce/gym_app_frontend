"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react"
import { useSalesHistory } from "@/src/features/pos/hooks/usePos"
import { formatCurrency, formatDate } from "@/src/utils/formatters"
import { PAGINATION } from "@/src/lib/constants"

const paymentMethodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
}

export default function SalesHistoryPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useSalesHistory({
    pagination: { page, pageSize: PAGINATION.DEFAULT_PAGE_SIZE },
  })

  const sales = data?.data || []
  const pagination = data?.meta?.pagination

  const handlePrint = (sale: Record<string, unknown>) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const items = (sale.items as Record<string, unknown>[]) || []
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td>${(item.product as Record<string, unknown>)?.name || "N/A"}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unitPrice as number)}</td>
            <td>${formatCurrency(item.subtotal as number)}</td>
          </tr>`
      )
      .join("")

    printWindow.document.write(`
      <html><head><title>Factura ${sale.receiptNumber || ""}</title>
      <style>body{font-family:monospace;padding:20px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:4px;text-align:left}</style>
      </head><body>
      <h2>Factura: ${sale.receiptNumber || "N/A"}</h2>
      <p>Fecha: ${formatDate(sale.saleDate as string, "datetime")}</p>
      <p>Cliente: ${(sale.client as Record<string, unknown>)?.fullName || "Mostrador"}</p>
      <table><thead><tr><th>Producto</th><th>Cant</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>
      ${itemsHtml}
      </tbody></table>
      <h3>Total: ${formatCurrency(sale.total as number)}</h3>
      <p>Método: ${paymentMethodLabels[sale.paymentMethod as string] || sale.paymentMethod}</p>
      </body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Historial de Ventas</h1>
        <a href="/pos">
          <Button variant="outline">Nueva Venta</Button>
        </a>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : sales.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Sin ventas registradas
                    </TableCell>
                  </TableRow>
                )
                : sales.map((s: Record<string, unknown>) => (
                    <TableRow key={s.id as number}>
                      <TableCell className="font-mono text-xs">{s.receiptNumber as string || "-"}</TableCell>
                      <TableCell className="font-medium">
                        {(s.client as Record<string, unknown>)?.fullName as string || "Mostrador"}
                      </TableCell>
                      <TableCell>{(s.items as unknown[])?.length || 0} items</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(s.total as number)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {paymentMethodLabels[s.paymentMethod as string] || s.paymentMethod as string}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(s.saleDate as string, "short")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handlePrint(s)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.pageCount > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.pageCount}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page >= (pagination.pageCount || 1)} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
