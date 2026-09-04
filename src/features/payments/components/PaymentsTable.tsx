"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { usePaymentsList, useDeletePayment } from "@/src/features/payments/hooks/usePayments"
import { formatCurrency, formatDate } from "@/src/utils/formatters"
import { PAGINATION, PAYMENT_METHOD_OPTIONS } from "@/src/lib/constants"
import { useDebounce } from "@/src/hooks/useDebounce"

const paymentMethodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
}

export function PaymentsTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const debouncedSearch = useDebounce(search, 300)

  const params = {
    pagination: { page, pageSize },
    sort: ["paymentDate:desc"],
    populate: "client,membership",
    filters: {
      ...(debouncedSearch
        ? { client: { fullName: { $containsi: debouncedSearch } } }
        : {}),
      ...(methodFilter !== "all" ? { paymentMethod: { $eq: methodFilter } } : {}),
    },
  }

  const { data, isLoading, isError, error } = usePaymentsList(params)
  const deleteMutation = useDeletePayment()

  const payments = data?.data || []
  const pagination = data?.meta?.pagination

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="page-title">Pagos de Membresías</h1><p className="page-description">Consulta y administra los pagos recibidos.</p></div>
        <Link href="/payments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
        </Link>
      </div>

      <div className="data-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={methodFilter}
          onValueChange={(value) => {
            if (value !== null) setMethodFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {PAYMENT_METHOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recibo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Membresía</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : isError
                ? <TableRow><TableCell colSpan={7} className="py-8 text-center text-destructive">Error al cargar pagos: {error instanceof Error ? error.message : "intenta nuevamente"}</TableCell></TableRow>
                : payments.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                )
                : payments.map((p: Record<string, unknown>) => (
                    <TableRow key={String(p.documentId ?? p.id)}>
                      <TableCell className="font-mono text-xs">
                        {p.receiptNumber as string || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {(p.client as Record<string, unknown>)?.fullName as string || "N/A"}
                      </TableCell>
                      <TableCell>
                        {(p.membership as Record<string, unknown>)?.name as string || "N/A"}
                      </TableCell>
                      <TableCell>{formatCurrency(p.amount as number)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {paymentMethodLabels[p.paymentMethod as string] || p.paymentMethod as string}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(p.paymentDate as string, "datetime")}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger render={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar pago?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={() => deleteMutation.mutate((p.documentId ?? p.id) as string | number)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= (pagination.pageCount || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
