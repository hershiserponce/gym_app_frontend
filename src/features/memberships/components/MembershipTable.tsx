"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react"
import {
  useMembershipsList,
  useDeleteMembership,
} from "@/src/features/memberships/hooks/useMemberships"
import { formatCurrency } from "@/src/utils/formatters"
import { PAGINATION } from "@/src/lib/constants"
import { useDebounce } from "@/src/hooks/useDebounce"

export function MembershipTable() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGINATION.DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const debouncedSearch = useDebounce(search, 300)

  const params = {
    pagination: { page, pageSize },
    sort: ["sortOrder:asc", "name:asc"],
    filters: {
      ...(debouncedSearch ? { name: { $containsi: debouncedSearch } } : {}),
      ...(activeFilter !== "all"
         ? { isActive: { $eq: activeFilter === "active" } }
        : {}),
    },
  }

  const { data, isLoading, isError, error } = useMembershipsList(params)
  const deleteMutation = useDeleteMembership()

  const memberships = data?.data || []
  const pagination = data?.meta?.pagination

  const handleDelete = (membership: Record<string, unknown>) => {
    deleteMutation.mutate((membership.documentId ?? membership.id) as string | number)
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="page-title">Membresías</h1><p className="page-description">Define los planes disponibles para tus clientes.</p></div>
        <Link href="/memberships/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Membresía
          </Button>
        </Link>
      </div>

      <div className="data-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={activeFilter}
          onValueChange={(value) => {
            if (value !== null) setActiveFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="inactive">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Orden</TableHead>
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
                      No se encontraron membresías
                    </TableCell>
                  </TableRow>
                )
                : memberships.map((m: Record<string, unknown>) => (
                    <TableRow key={String(m.documentId ?? m.id)}>
                      <TableCell>
                        <Circle
                          className="h-4 w-4"
                          style={{ color: (m.color as string) || "#3b82f6" }}
                          fill={(m.color as string) || "#3b82f6"}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {m.name as string}
                      </TableCell>
                      <TableCell>{formatCurrency(m.price as number)}</TableCell>
                      <TableCell>{m.duration as number} días</TableCell>
                      <TableCell>
                        <Badge
                          variant={m.isActive ? "default" : "secondary"}
                          className={m.isActive ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300" : ""}
                        >
                          {m.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>{m.sortOrder as number}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                           <Link href={`/memberships/${String(m.documentId ?? m.id)}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar membresía?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará
                                  la membresía <strong>{m.name as string}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                   onClick={() => handleDelete(m)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.pageCount} ({pagination.total} registros)
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                if (value !== null) setPageSize(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGINATION.PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
