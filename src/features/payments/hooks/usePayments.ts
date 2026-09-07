import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { paymentsService } from "@/src/services/payments"
import type { QueryParams } from "@/src/types/api"
import type { PaymentFormData } from "@/src/features/payments/types"
import type { EntityId } from "@/src/utils/strapi"
import { useTenantId } from "@/src/hooks/useTenantId"

export function usePaymentsList(params?: QueryParams) {
  const gymId = useTenantId()
  return useQuery({
    queryKey: ["payments", gymId, params],
    queryFn: () =>
      paymentsService.list({
        ...params,
        populate: "client,membership",
    }),
    enabled: gymId !== null,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PaymentFormData) =>
      paymentsService.create(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Pago registrado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar el pago")
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: EntityId) => paymentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["client-memberships"] })
      toast.success("Pago eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el pago")
    },
  })
}
