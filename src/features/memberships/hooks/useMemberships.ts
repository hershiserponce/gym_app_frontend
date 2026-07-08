import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { membershipsService } from "@/src/services/memberships"
import type { QueryParams } from "@/src/types/api"
import type { MembershipFormData } from "@/src/features/memberships/types"

export function useMembershipsList(params?: QueryParams) {
  return useQuery({
    queryKey: ["memberships", params],
    queryFn: () => membershipsService.list(params),
  })
}

export function useMembership(id: number) {
  return useQuery({
    queryKey: ["memberships", id],
    queryFn: () => membershipsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MembershipFormData) =>
      membershipsService.create(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      toast.success("Membresía creada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la membresía")
    },
  })
}

export function useUpdateMembership(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<MembershipFormData>) =>
      membershipsService.update(id, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
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
    mutationFn: (id: number) => membershipsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      toast.success("Membresía eliminada exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se puede eliminar: tiene clientes asociados")
    },
  })
}
