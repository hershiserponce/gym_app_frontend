"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useRef, useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import type { ProductFormData } from "@/src/features/inventory/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productCategoriesService } from "@/src/services/product-categories"
import { suppliersService } from "@/src/services/suppliers"

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  category: z.string().nullable().optional(),
  barcode: z.string().optional(),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  stock: z.number().min(0, "El stock debe ser mayor o igual a 0"),
  minStock: z.number().min(0, "El stock mínimo debe ser mayor o igual a 0"),
  supplier: z.string().nullable().optional(),
  isActive: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

type ProductFormProps = {
  defaultValues?: Partial<ProductFormValues>
  currentImageUrl?: string | null
  onSubmit: (data: ProductFormData) => void
  isPending: boolean
  onCancel?: () => void
}

export function ProductForm({
  defaultValues,
  currentImageUrl,
  onSubmit,
  isPending,
  onCancel,
}: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false)
  const [newSupplierForm, setNewSupplierForm] = useState({ name: "", contactPerson: "", address: "", notes: "" })
  const queryClient = useQueryClient()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: null,
      barcode: "",
      cost: undefined,
      price: undefined,
      stock: undefined,
      minStock: undefined,
      supplier: null,
      isActive: true,
      ...defaultValues,
    },
  })

  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories", "all"],
    queryFn: () => productCategoriesService.list({ pagination: { pageSize: 100 }, sort: ["name:asc"] }),
  })

  const categories = categoriesData?.data || []

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers", "all"],
    queryFn: () => suppliersService.list({ pagination: { pageSize: 100 }, sort: ["name:asc"] }),
  })

  const suppliers = suppliersData?.data || []

  const prevDefaultValues = useRef(defaultValues)
  useEffect(() => {
    if (defaultValues && JSON.stringify(defaultValues) !== JSON.stringify(prevDefaultValues.current)) {
      prevDefaultValues.current = defaultValues
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      productCategoriesService.create({ name }),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      form.setValue("category", String(newCategory.documentId ?? newCategory.id))
      setCategoryDialogOpen(false)
      setNewCategoryName("")
    },
  })

  const createSupplierMutation = useMutation({
    mutationFn: (form: { name: string; contactPerson: string; address: string; notes: string }) =>
      suppliersService.create({ name: form.name.trim(), contactPerson: form.contactPerson.trim() || null, address: form.address.trim() || null, notes: form.notes.trim() || null }),
    onSuccess: (newSupplier) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      form.setValue("supplier", String(newSupplier.documentId ?? newSupplier.id))
      setSupplierDialogOpen(false)
      setNewSupplierForm({ name: "", contactPerson: "", address: "", notes: "" })
    },
  })

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit({
      ...values,
      description: values.description?.trim() || "",
      category: values.category || null,
      barcode: values.barcode?.trim() || "",
      supplier: values.supplier || null,
      image: removeImage ? null : imageFile,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={() => (
            <FormItem>
              <FormLabel>Imagen del Producto</FormLabel>
              <FormControl>
                <ImageUpload
                  currentImageUrl={currentImageUrl}
                  onFileSelect={(file) => {
                    setImageFile(file)
                    setRemoveImage(false)
                  }}
                  onRemove={() => {
                    setImageFile(null)
                    setRemoveImage(true)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del producto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Barras</FormLabel>
                <FormControl>
                  <Input placeholder="123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <div className="flex gap-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c: Record<string, unknown>) => (
                        <SelectItem key={String(c.documentId ?? c.id)} value={String(c.documentId ?? c.id)}>
                          {c.name as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                    <DialogTrigger render={<Button type="button" variant="outline" size="icon" className="shrink-0"><Plus className="h-4 w-4" /></Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nueva Categoría</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Nombre de la categoría"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            if (newCategoryName.trim()) {
                              createCategoryMutation.mutate(newCategoryName.trim())
                            }
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            createCategoryMutation.mutate(newCategoryName.trim())
                          }
                        }}
                        disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                      >
                        {createCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <div className="flex gap-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((s: Record<string, unknown>) => (
                        <SelectItem key={String(s.documentId ?? s.id)} value={String(s.documentId ?? s.id)}>
                          {s.name as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
                    <DialogTrigger render={<Button type="button" variant="outline" size="icon" className="shrink-0"><Plus className="h-4 w-4" /></Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Proveedor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input
                          placeholder="Nombre *"
                          value={newSupplierForm.name}
                          onChange={(e) => setNewSupplierForm({ ...newSupplierForm, name: e.target.value })}
                        />
                        <Input
                          placeholder="Persona de contacto"
                          value={newSupplierForm.contactPerson}
                          onChange={(e) => setNewSupplierForm({ ...newSupplierForm, contactPerson: e.target.value })}
                        />
                        <Input
                          placeholder="Dirección"
                          value={newSupplierForm.address}
                          onChange={(e) => setNewSupplierForm({ ...newSupplierForm, address: e.target.value })}
                        />
                        <Textarea
                          placeholder="Notas"
                          value={newSupplierForm.notes}
                          onChange={(e) => setNewSupplierForm({ ...newSupplierForm, notes: e.target.value })}
                          className="min-h-[60px]"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (newSupplierForm.name.trim()) {
                            createSupplierMutation.mutate(newSupplierForm)
                          }
                        }}
                        disabled={!newSupplierForm.name.trim() || createSupplierMutation.isPending}
                      >
                        {createSupplierMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Crear
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de Venta</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Actual</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-6">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Activo</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del producto..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}
