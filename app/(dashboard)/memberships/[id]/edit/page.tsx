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
import { MembershipForm } from "@/src/features/memberships/components/MembershipForm"
import { useMembership, useUpdateMembership } from "@/src/features/memberships/hooks/useMemberships"

export default function EditMembershipPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)
  const { data: membership, isLoading } = useMembership(id)
  const updateMutation = useUpdateMembership(id)

  const handleSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => router.push("/memberships"),
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!membership) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Membresía no encontrada
      </div>
    )
  }

  const m = membership as Record<string, unknown>

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Membresía</CardTitle>
          <CardDescription>
            Modifica los datos de {m.name as string}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembershipForm
            defaultValues={{
              name: m.name as string,
              description: (m.description as string) || "",
              price: m.price as number,
              duration: m.duration as number,
              benefits: (m.benefits as string) || "",
              color: (m.color as string) || "#3b82f6",
              sortOrder: (m.sortOrder as number) || 0,
              isActive: m.isActive as boolean,
            }}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            onCancel={() => router.push("/memberships")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
