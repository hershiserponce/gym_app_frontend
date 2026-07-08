"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ClientForm } from "@/src/features/clients/components/ClientForm"
import { useCreateClient } from "@/src/features/clients/hooks/useClients"

export default function NewClientPage() {
  const router = useRouter()
  const createMutation = useCreateClient()

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data as Parameters<typeof createMutation.mutate>[0], {
      onSuccess: () => router.push("/clients"),
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Cliente</CardTitle>
          <CardDescription>
            Registra un nuevo cliente en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            onCancel={() => router.push("/clients")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
