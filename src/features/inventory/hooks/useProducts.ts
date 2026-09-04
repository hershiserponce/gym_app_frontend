import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsService } from "@/src/services/products"
import type { QueryParams } from "@/src/types/api"
import type { ProductFormData } from "@/src/features/inventory/types"
import type { EntityId } from "@/src/utils/strapi"
import { useTenantId } from "@/src/hooks/useTenantId"

export function useProductsList(params?: QueryParams) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["products", gymId, params],
    queryFn: () =>
      productsService.list({
        ...params,
        populate: "category",
    }),
    enabled: gymId !== null,
  })
}

export function useProduct(id: EntityId | undefined) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["products", gymId, id],
    queryFn: () =>
      productsService.getById(id!, { populate: "category,movements" }),
    enabled: id !== undefined && gymId !== null,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProductFormData) =>
      productsService.create(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["pos-products"] })
      toast.success("Producto creado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el producto")
    },
  })
}

export function useUpdateProduct(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<ProductFormData>) =>
      productsService.update(id, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["pos-products"] })
      toast.success("Producto actualizado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el producto")
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["pos-products"] })
      toast.success("Producto eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el producto")
    },
  })
}
