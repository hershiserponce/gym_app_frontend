import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { paymentsService } from "@/src/services/payments"
import type { QueryParams } from "@/src/types/api"
import type { PaymentFormData } from "@/src/features/payments/types"
import { clientMembershipsService } from "@/src/services/client-memberships"

export function usePaymentsList(params?: QueryParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () =>
      paymentsService.list({
        ...params,
        populate: "client,membership,clientMembership",
      }),
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const payment = await paymentsService.create(
        data as unknown as Record<string, unknown>
      )

      if (data.clientMembership) {
        const membership = await clientMembershipsService.getById(
          data.clientMembership
        )
        const m = membership as Record<string, unknown>
        if (m.status !== "active") {
          await clientMembershipsService.update(data.clientMembership, {
            status: "active",
          } as Record<string, unknown>)
        }
      }

      return payment
    },
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
    mutationFn: (id: number) => paymentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      toast.success("Pago eliminado exitosamente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el pago")
    },
  })
}
