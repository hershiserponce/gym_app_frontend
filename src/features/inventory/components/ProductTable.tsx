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
  Package,
} from "lucide-react"
import {
  useProductsList,
  useDeleteProduct,
} from "@/src/features/inventory/hooks/useProducts"
import { PAGINATION } from "@/src/lib/constants"
import { useDebounce } from "@/src/hooks/useDebounce"
import { useCurrency } from "@/src/hooks/useCurrency"

export function ProductTable() {
  const { formatValue } = useCurrency()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const params = {
    pagination: { page, pageSize },
    sort: ["name:asc"],
    populate: "category,supplier",
    filters: debouncedSearch
      ? { name: { $containsi: debouncedSearch } }
      : undefined,
  }

  const { data, isLoading, isError, error } = useProductsList(params)
  const deleteMutation = useDeleteProduct()

  const products = data?.data || []
  const pagination = data?.meta?.pagination

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="page-title">Productos</h1><p className="page-description">Controla existencias, precios y categorías.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/inventory/categories">
            <Button variant="outline">Categorías</Button>
          </Link>
          <Link href="/inventory/suppliers">
            <Button variant="outline">Proveedores</Button>
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

      <div className="data-toolbar relative max-w-xl">
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
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Proveedor</TableHead>
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
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : isError
                ? <TableRow><TableCell colSpan={9} className="py-8 text-center text-destructive">Error al cargar productos: {error instanceof Error ? error.message : "intenta nuevamente"}</TableCell></TableRow>
                : products.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                )
                : products.map((p: Record<string, unknown>) => (
                    <TableRow key={String(p.documentId ?? p.id)}>
                      <TableCell>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl as string}
                            alt={p.name as string}
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
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
                        {(p.supplier as Record<string, unknown>)?.name as string || "-"}
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
                          className={
                            (p.stock as number) <= 0
                              ? ""
                              : (p.stock as number) <= (p.minStock as number)
? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                                : "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          }
                        >
                          {p.stock as number}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatValue(p.price as number)}</TableCell>
                      <TableCell>{formatValue(p.cost as number)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={p.isActive ? "default" : "secondary"}
                          className={p.isActive ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50" : ""}
                        >
                          {p.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                           <Link href={`/inventory/products/${String(p.documentId ?? p.id)}/edit`}>
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
                                   onClick={() => deleteMutation.mutate((p.documentId ?? p.id) as string | number)}
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
