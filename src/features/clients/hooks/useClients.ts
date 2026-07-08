import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { clientsService } from "@/src/services/clients"
import type { QueryParams } from "@/src/types/api"
import type { ClientFormData } from "@/src/features/clients/types"

export function useClientsList(params?: QueryParams) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => clientsService.list(params),
  })
}

export function useClient(id: number) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientsService.getById(id, { populate: "memberships,sales" }),
    enabled: !!id,
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
      toast.error(error.message || "Error al crear el cliente")
    },
  })
}

export function useUpdateClient(id: number) {
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
    mutationFn: (id: number) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success("Cliente eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el cliente")
    },
  })
}
