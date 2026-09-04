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
  Search,
  Snowflake,
  RotateCcw,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  useClientMembershipsList,
  useUpdateClientMembership,
} from "@/src/features/client-memberships/hooks/useClientMemberships"
import { formatDate, daysRemaining } from "@/src/utils/formatters"
import { PAGINATION, MEMBERSHIP_STATUS_OPTIONS } from "@/src/lib/constants"
import { useDebounce } from "@/src/hooks/useDebounce"
import { toast } from "sonner"

const statusLabels: Record<string, string> = {
  active: "Activa",
  expired: "Vencida",
  frozen: "Congelada",
  cancelled: "Cancelada",
}

const statusVariants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  expired: "destructive",
  frozen: "secondary",
  cancelled: "outline",
}

export function ClientMembershipTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const debouncedSearch = useDebounce(search, 300)

  const params = {
    pagination: { page, pageSize },
    sort: ["endDate:asc"],
    populate: "client,membership",
    filters: {
      ...(debouncedSearch
        ? { client: { fullName: { $containsi: debouncedSearch } } }
        : {}),
      ...(statusFilter !== "all" ? { status: { $eq: statusFilter } } : {}),
    },
  }

  const { data, isLoading, isError, error } = useClientMembershipsList(params)
  const updateMutation = useUpdateClientMembership()

  const memberships = data?.data || []
  const pagination = data?.meta?.pagination

  const handleStatusChange = (id: string | number, newStatus: string) => {
    updateMutation.mutate(
      { id, data: { status: newStatus } as Partial<import("@/src/features/client-memberships/types").ClientMembershipFormData> },
      {
        onSuccess: () => {
          const label = statusLabels[newStatus] || newStatus
          toast.success(`Membresía ${label.toLowerCase()} exitosamente`)
        },
      }
    )
  }

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Gestión de Membresías</h1>
        <p className="page-description">Supervisa el estado y vigencia de las membresías.</p>
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
          value={statusFilter}
          onValueChange={(value) => {
            if (value !== null) setStatusFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {MEMBERSHIP_STATUS_OPTIONS.map((opt) => (
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
              <TableHead>Cliente</TableHead>
              <TableHead>Membresía</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Días Rest.</TableHead>
              <TableHead>Estado</TableHead>
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
                ? <TableRow><TableCell colSpan={7} className="py-8 text-center text-destructive">Error al cargar membresías: {error instanceof Error ? error.message : "intenta nuevamente"}</TableCell></TableRow>
                : memberships.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                )
                : memberships.map((m: Record<string, unknown>) => {
                    const remaining = daysRemaining(m.endDate as string)
                    return (
                      <TableRow key={String(m.documentId ?? m.id)}>
                        <TableCell className="font-medium">
                          {(m.client as Record<string, unknown>)?.fullName as string}
                        </TableCell>
                        <TableCell>
                          {(m.membership as Record<string, unknown>)?.name as string}
                        </TableCell>
                        <TableCell>{formatDate(m.startDate as string, "short")}</TableCell>
                        <TableCell>{formatDate(m.endDate as string, "short")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              remaining <= 0
                                ? "destructive"
                                : remaining <= 7
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {remaining} días
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[m.status as string] || "default"}>
                            {statusLabels[m.status as string] || m.status as string}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {m.status === "active" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Congelar"
                                  onClick={() =>
                                    handleStatusChange(
                                       (m.documentId ?? m.id) as string | number,
                                      "frozen"
                                    )
                                  }
                                >
                                  <Snowflake className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Cancelar"
                                  onClick={() =>
                                    handleStatusChange(
                                       (m.documentId ?? m.id) as string | number,
                                      "cancelled"
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                            {m.status === "frozen" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Reactivar"
                                onClick={() =>
                                  handleStatusChange(
                                     (m.documentId ?? m.id) as string | number,
                                    "active"
                                  )
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                            {(m.status === "expired" || m.status === "cancelled") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Renovar"
                                onClick={() =>
                                  handleStatusChange(
                                   (m.documentId ?? m.id) as string | number,
                                    "active"
                                  )
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
