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
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import {
  useProductsList,
  useDeleteProduct,
} from "@/src/features/inventory/hooks/useProducts"
import { formatCurrency } from "@/src/utils/formatters"
import { PAGINATION } from "@/src/lib/constants"
import { useDebounce } from "@/src/hooks/useDebounce"

export function ProductTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const params = {
    pagination: { page, pageSize },
    sort: ["name:asc"],
    populate: "category",
    filters: debouncedSearch
      ? { name: { $containsi: debouncedSearch } }
      : undefined,
  }

  const { data, isLoading } = useProductsList(params)
  const deleteMutation = useDeleteProduct()

  const products = data?.data || []
  const pagination = data?.meta?.pagination

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <div className="flex gap-2">
          <Link href="/inventory/categories">
            <Button variant="outline">Categorías</Button>
          </Link>
          <Link href="/inventory/movements">
            <Button variant="outline">Movimientos</Button>
          </Link>
          <Link href="/inventory/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex-1 max-w-sm">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Costo</TableHead>
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
              : products.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                )
                : products.map((p: Record<string, unknown>) => (
                    <TableRow key={p.id as number}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {p.name as string}
                          {(p.stock as number) <= (p.minStock as number) && (
                            <AlertTriangle className="h-4 w-4 text-destructive" aria-label="Stock bajo" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(p.category as Record<string, unknown>)?.name as string || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            (p.stock as number) <= 0
                              ? "destructive"
                              : (p.stock as number) <= (p.minStock as number)
                                ? "secondary"
                                : "default"
                          }
                        >
                          {p.stock as number}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(p.price as number)}</TableCell>
                      <TableCell>{formatCurrency(p.cost as number)}</TableCell>
                      <TableCell>
                        <Badge variant={p.isActive ? "default" : "secondary"}>
                          {p.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/inventory/products/${p.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Se eliminará {p.name as string} permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(p.id as number)}
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
