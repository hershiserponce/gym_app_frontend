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
import { Input } from "@/components/ui/input"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productCategoriesService } from "@/src/services/product-categories"
import { useDebounce } from "@/src/hooks/useDebounce"
import { Search } from "lucide-react"

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [newName, setNewName] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["product-categories", debouncedSearch],
    queryFn: () =>
      productCategoriesService.list({
        sort: ["name:asc"],
        filters: debouncedSearch
          ? { name: { $containsi: debouncedSearch } }
          : undefined,
      }),
  })

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      productCategoriesService.create({ name } as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      setNewName("")
      toast.success("Categoría creada")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      productCategoriesService.update(id, { name } as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      setEditingId(null)
      toast.success("Categoría actualizada")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productCategoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      toast.success("Categoría eliminada")
    },
  })

  const categories = data?.data || []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <a href="/inventory/products">
          <Button variant="outline">Volver a Productos</Button>
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la categoría"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) {
                  createMutation.mutate(newName.trim())
                }
              }}
            />
            <Button
              onClick={() => newName.trim() && createMutation.mutate(newName.trim())}
              disabled={!newName.trim() || createMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar categorías..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : categories.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                      No hay categorías
                    </TableCell>
                  </TableRow>
                )
                : categories.map((c: Record<string, unknown>) => (
                    <TableRow key={c.id as number}>
                      <TableCell>
                        {editingId === c.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          c.name as string
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === c.id ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateMutation.mutate({
                                  id: c.id as number,
                                  name: editName,
                                })
                              }
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingId(c.id as number)
                                setEditName(c.name as string)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger render={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Se eliminará {c.name as string}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(c.id as number)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
