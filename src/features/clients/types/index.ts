import type { ClientMembershipData } from "@/src/services/client-memberships"
import type { SaleData } from "@/src/services/sales"

export type ClientFormData = {
  fullName: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: "male" | "female" | "other" | null
  notes: string | null
  status: "active" | "inactive"
  address: string | null
}

export type ClientWithRelations = {
  id: number
  documentId: string
  fullName: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: "male" | "female" | "other" | null
  photo: unknown | null
  notes: string | null
  status: "active" | "inactive"
  registrationDate: string
  address: string | null
  memberships?: ClientMembershipData[]
  sales?: SaleData[]
}
