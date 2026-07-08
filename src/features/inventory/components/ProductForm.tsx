"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
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
import { Loader2 } from "lucide-react"
import type { ProductFormData } from "@/src/features/inventory/types"
import { useQuery } from "@tanstack/react-query"
import { productCategoriesService } from "@/src/services/product-categories"

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  category: z.number().optional(),
  barcode: z.string().optional(),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  stock: z.number().min(0, "El stock debe ser mayor o igual a 0"),
  minStock: z.number().min(0, "El stock mínimo debe ser mayor o igual a 0"),
  supplier: z.string().optional(),
  isActive: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

type ProductFormProps = {
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (data: ProductFormValues) => void
  isPending: boolean
  onCancel?: () => void
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: undefined as unknown as number,
      barcode: "",
      cost: 0,
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: "",
      isActive: true,
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues)
  }, [defaultValues, form])

  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories", "all"],
    queryFn: () => productCategoriesService.list({ pagination: { pageSize: 100 }, sort: ["name:asc"] }),
  })

  const categories = categoriesData?.data || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c: Record<string, unknown>) => (
                      <SelectItem key={c.id as number} value={String(c.id)}>
                        {c.name as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del proveedor" {...field} />
                </FormControl>
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
                  <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                  <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                  <Input type="number" min="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                  <Input type="number" min="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
