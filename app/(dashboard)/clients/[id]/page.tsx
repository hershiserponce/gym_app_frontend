import { ClientDetail } from "@/src/features/clients/components/ClientDetail"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ClientDetail clientId={String(id)} />
}
