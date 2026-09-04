import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsService } from "@/src/services/products"
import { salesService } from "@/src/services/sales"
import { inventoryMovementsService } from "@/src/services/inventory-movements"
import { useCartStore } from "@/src/store/cart-store"
import { useTenantId } from "@/src/hooks/useTenantId"
import type { SalePayload } from "@/src/features/pos/types"

export function usePosProducts(search?: string) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["pos-products", gymId, search],
    queryFn: () =>
      productsService.list({
         pagination: { page: 1, pageSize: 50 },
        sort: ["name:asc"],
        filters: {
           isActive: { $eq: true },
          ...(search ? { name: { $containsi: search } } : {}),
        },
      }),
    enabled: gymId !== null,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  const clearCart = useCartStore((state) => state.clearCart)

  return useMutation({
    mutationFn: async (data: SalePayload) => {
      const products = await Promise.all(
        data.items.map((item) => productsService.getById(item.product))
      )
      products.forEach((product, index) => {
        const stock = Number((product as Record<string, unknown>).stock ?? 0)
        if (data.items[index].quantity > stock) {
          throw new Error(`Stock insuficiente para ${(product as Record<string, unknown>).name || "el producto"}. Disponible: ${stock}`)
        }
      })
      const sale = await salesService.create(
        data as unknown as Record<string, unknown>
      )

      for (const [index, item] of data.items.entries()) {
        await inventoryMovementsService.create({
          product: item.product,
          type: "out",
          quantity: item.quantity,
          referenceType: "sale",
          notes: `Venta #${(sale as Record<string, unknown>).documentId ?? (sale as Record<string, unknown>).id}`,
        } as Record<string, unknown>)

        const product = products[index] as Record<string, unknown>
        await productsService.update(item.product, {
          stock: Math.max(0, Number(product.stock ?? 0) - item.quantity),
        } as Record<string, unknown>)
      }

      return sale
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] })
      queryClient.invalidateQueries({ queryKey: ["sales"] })
      clearCart()
      toast.success("Venta registrada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar la venta")
    },
  })
}

export function useSalesHistory(params?: Record<string, unknown>) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["sales", gymId, params],
    queryFn: () =>
      salesService.list({
        ...params,
        sort: ["saleDate:desc"],
        populate: "client,items,items.product",
      } as Record<string, unknown>),
    enabled: gymId !== null,
  })
}
