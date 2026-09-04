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
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { auditLogsService } from "@/src/services/audit-logs"
import { formatDate } from "@/src/utils/formatters"
import { PAGINATION } from "@/src/lib/constants"
import { useDebounce } from "@/src/hooks/useDebounce"

export default function AuditPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["audit-logs", page, debouncedSearch],
    queryFn: () =>
      auditLogsService.list({
        pagination: { page, pageSize: PAGINATION.DEFAULT_PAGE_SIZE },
        sort: ["createdAt:desc"],
        populate: "user",
        filters: debouncedSearch
          ? { action: { $containsi: debouncedSearch } }
          : undefined,
      }),
  })

  const logs = data?.data || []
  const pagination = data?.meta?.pagination

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auditoría</h1>
        <p className="text-muted-foreground">
          Registro de actividades del sistema
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por acción..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Acción</TableHead>
              <TableHead>Entidad</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Fecha</TableHead>
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
              : isError
                ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-destructive">Error al cargar auditoría: {error instanceof Error ? error.message : "intenta nuevamente"}</TableCell></TableRow>
                : logs.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Sin registros de auditoría
                    </TableCell>
                  </TableRow>
                )
                : logs.map((log: Record<string, unknown>) => (
                    <TableRow key={log.id as number}>
                      <TableCell className="font-mono text-xs">{log.action as string}</TableCell>
                      <TableCell>{log.entity as string}</TableCell>
                      <TableCell>{log.entityId as number}</TableCell>
                      <TableCell>
                        {(log.user as Record<string, unknown>)?.username as string || "Sistema"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.ipAddress as string || "-"}
                      </TableCell>
                      <TableCell>
                        {formatDate((log as Record<string, unknown>).createdAt as string || "", "datetime")}
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
