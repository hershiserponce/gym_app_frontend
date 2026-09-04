"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { PAYMENT_METHOD_OPTIONS } from "@/src/lib/constants"
import type { PaymentFormData } from "@/src/features/payments/types"
import { useClientsList } from "@/src/features/clients/hooks/useClients"
import { useMembershipsList } from "@/src/features/memberships/hooks/useMemberships"
import { useClientMembershipsList } from "@/src/features/client-memberships/hooks/useClientMemberships"

const paymentSchema = z.object({
  client: z.string().min(1, "Selecciona un cliente"),
  membership: z.string().min(1, "Selecciona una membresía"),
  clientMembership: z.string().optional(),
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  paymentMethod: z.enum(["cash", "card", "transfer", "other"]),
  paymentDate: z.string().min(1, "La fecha es requerida"),
  notes: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

type PaymentFormProps = {
  defaultValues?: Partial<PaymentFormValues>
  onSubmit: (data: PaymentFormValues) => void
  isPending: boolean
  onCancel?: () => void
}

export function PaymentForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
}: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      client: "",
      membership: "",
      amount: 0,
      paymentMethod: "cash",
      paymentDate: new Date().toISOString().slice(0, 16),
      notes: "",
      ...defaultValues,
    },
  })

  const selectedClient = form.watch("client")
  const selectedMembership = form.watch("membership")

  const { data: clientsData } = useClientsList({
    pagination: { pageSize: 100 },
    sort: ["fullName:asc"],
  })

  const { data: membershipsData } = useMembershipsList({
    pagination: { pageSize: 100 },
    sort: ["name:asc"],
     filters: { isActive: { $eq: true } },
  })

  const { data: clientMembershipsData } = useClientMembershipsList({
    pagination: { pageSize: 100 },
    filters: selectedClient
      ? { client: { documentId: { $eq: selectedClient } }, status: { $in: ["active", "frozen"] } }
      : {},
    populate: "client,membership",
  })

  const clients = clientsData?.data || []
  const memberships = membershipsData?.data || []
  const clientMemberships = clientMembershipsData?.data || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((c: Record<string, unknown>) => (
                      <SelectItem key={String(c.documentId ?? c.id)} value={String(c.documentId ?? c.id)}>
                        {c.fullName as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="membership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membresía</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar membresía..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberships.map((m: Record<string, unknown>) => (
                      <SelectItem key={String(m.documentId ?? m.id)} value={String(m.documentId ?? m.id)}>
                        {m.name as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="clientMembership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suscripción (opcional)</FormLabel>
                <Select
                  onValueChange={(v) =>
                    field.onChange(v || undefined)
                  }
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar suscripción..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientMemberships.map((cm: Record<string, unknown>) => (
                      <SelectItem
                        key={String(cm.documentId ?? cm.id)}
                        value={String(cm.documentId ?? cm.id)}
                      >
                        {(cm.membership as Record<string, unknown>)?.name as string} -{" "}
                        {(cm.client as Record<string, unknown>)?.fullName as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Pago</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="notes"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notas adicionales..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar Pago
          </Button>
        </div>
      </form>
    </Form>
  )
}
