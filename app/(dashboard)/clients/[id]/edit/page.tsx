"use client"

import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ClientForm } from "@/src/features/clients/components/ClientForm"
import { useClient, useUpdateClient } from "@/src/features/clients/hooks/useClients"

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)
  const { data: client, isLoading } = useClient(id)
  const updateMutation = useUpdateClient(id)

  const handleSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => router.push("/clients"),
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Cliente no encontrado
      </div>
    )
  }

  const c = client as Record<string, unknown>

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Modifica los datos del cliente {c.fullName as string}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm
            defaultValues={{
              fullName: c.fullName as string,
              email: (c.email as string) || "",
              phone: (c.phone as string) || "",
              dateOfBirth: (c.dateOfBirth as string) || "",
              gender: (c.gender as "male" | "female" | "other" | "") || "",
              notes: (c.notes as string) || "",
              status: c.status as "active" | "inactive",
              address: (c.address as string) || "",
            }}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            onCancel={() => router.push("/clients")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
