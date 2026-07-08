"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MembershipForm } from "@/src/features/memberships/components/MembershipForm"
import { useCreateMembership } from "@/src/features/memberships/hooks/useMemberships"

export default function NewMembershipPage() {
  const router = useRouter()
  const createMutation = useCreateMembership()

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data as Parameters<typeof createMutation.mutate>[0], {
      onSuccess: () => router.push("/memberships"),
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Membresía</CardTitle>
          <CardDescription>
            Crea un nuevo plan de membresía
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembershipForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            onCancel={() => router.push("/memberships")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
