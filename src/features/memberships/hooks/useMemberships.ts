import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { membershipsService } from "@/src/services/memberships"
import type { QueryParams } from "@/src/types/api"
import type { MembershipFormData } from "@/src/features/memberships/types"
import type { EntityId } from "@/src/utils/strapi"
import { useTenantId } from "@/src/hooks/useTenantId"

export function useMembershipsList(params?: QueryParams) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["memberships", gymId, params],
    queryFn: () => membershipsService.list(params),
    enabled: gymId !== null,
  })
}

export function useMembership(id: EntityId | undefined) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["memberships", gymId, id],
    queryFn: () => membershipsService.getById(id!),
    enabled: id !== undefined && gymId !== null,
  })
}

export function useCreateMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MembershipFormData) =>
      membershipsService.create(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Membresía creada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la membresía")
    },
  })
}

export function useUpdateMembership(id: EntityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<MembershipFormData>) =>
      membershipsService.update(id, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Membresía actualizada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la membresía")
    },
  })
}

export function useDeleteMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => membershipsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Membresía eliminada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se puede eliminar: tiene clientes asociados")
    },
  })
}
