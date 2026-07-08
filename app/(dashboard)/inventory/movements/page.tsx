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
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { inventoryMovementsService } from "@/src/services/inventory-movements"
import { formatDate } from "@/src/utils/formatters"
import { PAGINATION } from "@/src/lib/constants"

const typeLabels: Record<string, string> = { in: "Entrada", out: "Salida", adjustment: "Ajuste" }
const typeVariants: Record<string, "default" | "destructive" | "secondary"> = { in: "default", out: "destructive", adjustment: "secondary" }

export default function MovementsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-movements", { page }],
    queryFn: () =>
      inventoryMovementsService.list({
        pagination: { page, pageSize: PAGINATION.DEFAULT_PAGE_SIZE },
        sort: ["movementDate:desc"],
        populate: "product",
      }),
  })

  const movements = data?.data || []
  const pagination = data?.meta?.pagination

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movimientos de Inventario</h1>
        <a href="/inventory/products">
          <Button variant="outline">Volver a Productos</Button>
        </a>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : movements.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Sin movimientos
                    </TableCell>
                  </TableRow>
                )
                : movements.map((m: Record<string, unknown>) => (
                    <TableRow key={m.id as number}>
                      <TableCell className="font-medium">
                        {(m.product as Record<string, unknown>)?.name as string || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeVariants[m.type as string] || "default"}>
                          {typeLabels[m.type as string] || m.type as string}
                        </Badge>
                      </TableCell>
                      <TableCell className={m.type === "out" ? "text-destructive" : "text-green-600"}>
                        {m.type === "out" ? "-" : "+"}{Math.abs(m.quantity as number)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {m.referenceType as string || "-"}
                      </TableCell>
                      <TableCell>{formatDate(m.movementDate as string, "short")}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {m.notes as string || "-"}
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
