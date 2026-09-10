"use client"

import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductForm } from "@/src/features/inventory/components/ProductForm"
import { useProduct, useUpdateProduct } from "@/src/features/inventory/hooks/useProducts"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)
  const { data: product, isLoading } = useProduct(id)
  const updateMutation = useUpdateProduct(id)

  const handleSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => router.push("/inventory/products"),
    })
  }

  if (isLoading) return <Skeleton className="h-48 w-full max-w-2xl mx-auto" />
  if (!product) return <div className="text-center py-12 text-muted-foreground">Producto no encontrado</div>

  const p = product as Record<string, unknown>

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
          <CardDescription>Modifica los datos de {p.name as string}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            defaultValues={{
              name: p.name as string,
              description: (p.description as string) || "",
               category: ((p.category as Record<string, unknown>)?.documentId as string) || ((p.category as Record<string, unknown>)?.id != null ? String((p.category as Record<string, unknown>)?.id) : null),
              barcode: (p.barcode as string) || "",
              cost: p.cost as number,
              price: p.price as number,
              stock: p.stock as number,
              minStock: p.minStock as number,
              supplier: (p.supplier as string) || "",
              isActive: p.isActive as boolean,
            }}
            currentImageUrl={p.imageUrl as string | null}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            onCancel={() => router.push("/inventory/products")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
