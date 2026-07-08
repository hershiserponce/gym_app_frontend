import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsService } from "@/src/services/products"
import { salesService } from "@/src/services/sales"
import { inventoryMovementsService } from "@/src/services/inventory-movements"
import { useCartStore } from "@/src/store/cart-store"
import type { SalePayload } from "@/src/features/pos/types"

export function usePosProducts(search?: string) {
  return useQuery({
    queryKey: ["pos-products", search],
    queryFn: () =>
      productsService.list({
        pagination: { pageSize: 50 },
        sort: ["name:asc"],
        filters: {
          isActive: true,
          ...(search ? { name: { $containsi: search } } : {}),
        },
      }),
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  const clearCart = useCartStore((state) => state.clearCart)

  return useMutation({
    mutationFn: async (data: SalePayload) => {
      const sale = await salesService.create(
        data as unknown as Record<string, unknown>
      )

      for (const item of data.items) {
        await inventoryMovementsService.create({
          product: item.product,
          type: "out",
          quantity: item.quantity,
          referenceType: "sale",
          notes: `Venta #${(sale as Record<string, unknown>).id}`,
        } as Record<string, unknown>)

        const product = await productsService.getById(item.product)
        const p = product as Record<string, unknown>
        await productsService.update(item.product, {
          stock: Math.max(0, (p.stock as number) - item.quantity),
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
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () =>
      salesService.list({
        ...params,
        sort: ["saleDate:desc"],
        populate: "client,items,items.product",
      } as Record<string, unknown>),
  })
}
