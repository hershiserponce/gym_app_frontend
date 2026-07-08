import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { clientMembershipsService } from "@/src/services/client-memberships"
import type { QueryParams } from "@/src/types/api"
import type { ClientMembershipFormData } from "@/src/features/client-memberships/types"

export function useClientMembershipsList(params?: QueryParams) {
  return useQuery({
    queryKey: ["client-memberships", params],
    queryFn: () =>
      clientMembershipsService.list({
        ...params,
        populate: "client,membership",
      }),
  })
}

export function useClientMembership(id: number) {
  return useQuery({
    queryKey: ["client-memberships", id],
    queryFn: () =>
      clientMembershipsService.getById(id, {
        populate: "client,membership,payments",
      }),
    enabled: !!id,
  })
}

export function useCreateClientMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ClientMembershipFormData) =>
      clientMembershipsService.create(
        data as unknown as Record<string, unknown>
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Membresía asignada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al asignar la membresía")
    },
  })
}

export function useUpdateClientMembership(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<ClientMembershipFormData>) =>
      clientMembershipsService.update(
        id,
        data as unknown as Record<string, unknown>
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Membresía actualizada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la membresía")
    },
  })
}

export function useDeleteClientMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => clientMembershipsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Registro eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el registro")
    },
  })
}
