import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { clientMembershipsService } from "@/src/services/client-memberships"
import type { QueryParams } from "@/src/types/api"
import type { ClientMembershipFormData } from "@/src/features/client-memberships/types"
import type { EntityId } from "@/src/utils/strapi"
import { useTenantId } from "@/src/hooks/useTenantId"

export function useClientMembershipsList(params?: QueryParams) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["client-memberships", gymId, params],
    queryFn: () =>
      clientMembershipsService.list({
        ...params,
        populate: "client,membership",
    }),
    enabled: gymId !== null,
  })
}

export function useClientMembership(id: EntityId | undefined) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["client-memberships", gymId, id],
    queryFn: () =>
      clientMembershipsService.getById(id!, {
        populate: "client,membership,payments",
      }),
    enabled: id !== undefined && gymId !== null,
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
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      toast.success("Membresía asignada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al asignar la membresía")
    },
  })
}

export function useUpdateClientMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: EntityId; data: Partial<ClientMembershipFormData> }) =>
      clientMembershipsService.update(
        id,
        data as unknown as Record<string, unknown>
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      queryClient.invalidateQueries({ queryKey: ["payments"] })
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
    mutationFn: (id: EntityId) => clientMembershipsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Registro eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el registro")
    },
  })
}
