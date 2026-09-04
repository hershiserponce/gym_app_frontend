import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { clientsService } from "@/src/services/clients"
import type { QueryParams } from "@/src/types/api"
import type { ClientFormData } from "@/src/features/clients/types"
import type { EntityId } from "@/src/utils/strapi"
import { useTenantId } from "@/src/hooks/useTenantId"

export function useClientsList(params?: QueryParams) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["clients", gymId, params],
    queryFn: () => clientsService.list(params),
    enabled: gymId !== null,
  })
}

export function useClient(id: EntityId | undefined) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["clients", gymId, id],
    queryFn: () => clientsService.getById(id!, { populate: "memberships,sales" }),
    enabled: id !== undefined && gymId !== null,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ClientFormData) => clientsService.create(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success("Cliente creado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error instanceof Error ? error.message : "Error al crear el cliente")
    },
  })
}

export function useUpdateClient(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<ClientFormData>) => clientsService.update(id, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success("Cliente actualizado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el cliente")
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success("Cliente eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el cliente")
    },
  })
}
