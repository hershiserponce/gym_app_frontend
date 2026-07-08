"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PaymentForm } from "@/src/features/payments/components/PaymentForm"
import { useCreatePayment } from "@/src/features/payments/hooks/usePayments"

export default function NewPaymentPage() {
  const router = useRouter()
  const createMutation = useCreatePayment()

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data as Parameters<typeof createMutation.mutate>[0], {
      onSuccess: () => router.push("/payments"),
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Pago</CardTitle>
          <CardDescription>
            Registra un nuevo pago de membresía
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            onCancel={() => router.push("/payments")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
