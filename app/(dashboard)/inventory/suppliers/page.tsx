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
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Search,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { suppliersService, type SupplierData } from "@/src/services/suppliers"
import { useDebounce } from "@/src/hooks/useDebounce"

type SupplierFormValues = {
  name: string
  contactPerson: string
  address: string
  notes: string
}

const emptyForm: SupplierFormValues = {
  name: "",
  contactPerson: "",
  address: "",
  notes: "",
}

export default function SuppliersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [editForm, setEditForm] = useState<SupplierFormValues>(emptyForm)
  const [newForm, setNewForm] = useState<SupplierFormValues>(emptyForm)
  const [dialogOpen, setDialogOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["suppliers", debouncedSearch],
    queryFn: () =>
      suppliersService.list({
        sort: ["name:asc"],
        filters: debouncedSearch
          ? { name: { $containsi: debouncedSearch } }
          : undefined,
      }),
  })

  const createMutation = useMutation({
    mutationFn: (form: SupplierFormValues) =>
      suppliersService.create({ name: form.name.trim(), contactPerson: form.contactPerson.trim() || null, address: form.address.trim() || null, notes: form.notes.trim() || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      setNewForm(emptyForm)
      setDialogOpen(false)
      toast.success("Proveedor creado")
    },
    onError: (err: Error) => toast.error(err.message || "Error al crear el proveedor"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string | number; form: SupplierFormValues }) =>
      suppliersService.update(id, { name: form.name.trim(), contactPerson: form.contactPerson.trim() || null, address: form.address.trim() || null, notes: form.notes.trim() || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      setEditingId(null)
      toast.success("Proveedor actualizado")
    },
    onError: (err: Error) => toast.error(err.message || "Error al actualizar el proveedor"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => suppliersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      toast.success("Proveedor eliminado")
    },
    onError: (err: Error) => toast.error(err.message || "Error al eliminar el proveedor"),
  })

  const suppliers = (data?.data || []) as SupplierData[]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <a href="/inventory/products">
          <Button variant="outline">Volver a Productos</Button>
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Nuevo Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Nombre *"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
            />
            <Input
              placeholder="Persona de contacto"
              value={newForm.contactPerson}
              onChange={(e) => setNewForm({ ...newForm, contactPerson: e.target.value })}
            />
            <Input
              placeholder="Dirección"
              value={newForm.address}
              onChange={(e) => setNewForm({ ...newForm, address: e.target.value })}
              className="sm:col-span-2"
            />
            <Textarea
              placeholder="Notas"
              value={newForm.notes}
              onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
              className="sm:col-span-2 min-h-[60px]"
            />
          </div>
          <Button
            className="mt-3"
            onClick={() => newForm.name.trim() && createMutation.mutate(newForm)}
            disabled={!newForm.name.trim() || createMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar proveedores..."
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
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-right w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : isError
                ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-destructive">Error al cargar proveedores: {error instanceof Error ? error.message : "intenta nuevamente"}</TableCell></TableRow>
                : suppliers.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay proveedores
                    </TableCell>
                  </TableRow>
                )
                : suppliers.map((s) => (
                    <TableRow key={String(s.documentId ?? s.id)}>
                      <TableCell className="font-medium">
                        {editingId === (s.documentId ?? s.id) ? (
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          s.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === (s.documentId ?? s.id) ? (
                          <Input
                            value={editForm.contactPerson}
                            onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          s.contactPerson || "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === (s.documentId ?? s.id) ? (
                          <Input
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          s.address || "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === (s.documentId ?? s.id) ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateMutation.mutate({
                                  id: (s.documentId ?? s.id) as string | number,
                                  form: editForm,
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
                                setEditingId(s.documentId ?? s.id)
                                setEditForm({
                                  name: s.name,
                                  contactPerson: s.contactPerson || "",
                                  address: s.address || "",
                                  notes: s.notes || "",
                                })
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger render={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Se eliminará {s.name} permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate((s.documentId ?? s.id) as string | number)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Proveedor</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
