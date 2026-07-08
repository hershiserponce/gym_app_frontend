"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductForm } from "@/src/features/inventory/components/ProductForm"
import { useCreateProduct } from "@/src/features/inventory/hooks/useProducts"

export default function NewProductPage() {
  const router = useRouter()
  const createMutation = useCreateProduct()

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data as Parameters<typeof createMutation.mutate>[0], {
      onSuccess: () => router.push("/inventory/products"),
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
          <CardDescription>Agrega un nuevo producto al inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            onCancel={() => router.push("/inventory/products")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
