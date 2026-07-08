"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
} from "lucide-react"
import { useClient } from "@/src/features/clients/hooks/useClients"
import { formatDate, formatCurrency, getInitials, formatPhone } from "@/src/utils/formatters"

type ClientDetailProps = {
  clientId: number
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const { data: client, isLoading } = useClient(clientId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(c.fullName as string)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{c.fullName as string}</CardTitle>
              <CardDescription>
                Registrado el {formatDate(c.registrationDate as string, "long")}
              </CardDescription>
            </div>
            <Badge
              variant={c.status === "active" ? "default" : "secondary"}
              className="ml-auto"
            >
              {c.status === "active" ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{(c.email as string) || "Sin correo"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{c.phone ? formatPhone(c.phone as string) : "Sin teléfono"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {c.dateOfBirth
                  ? formatDate(c.dateOfBirth as string, "long")
                  : "Sin fecha de nacimiento"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                {c.gender === "male"
                  ? "Masculino"
                  : c.gender === "female"
                    ? "Femenino"
                    : "No especificado"}
              </span>
            </div>
            {(c.address as string) && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{c.address as string}</span>
              </div>
            )}
          </div>
          {(c.notes as string) && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Observaciones</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {c.notes as string}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Membresías</CardTitle>
        </CardHeader>
        <CardContent>
          {c.memberships && (c.memberships as unknown[]).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(c.memberships as Record<string, unknown>[]).map(
                  (m: Record<string, unknown>) => (
                    <TableRow key={m.id as number}>
                      <TableCell>
                        {(m.membership as Record<string, unknown>)?.name as string}
                      </TableCell>
                      <TableCell>
                        {formatDate(m.startDate as string, "short")}
                      </TableCell>
                      <TableCell>
                        {formatDate(m.endDate as string, "short")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            m.status === "active"
                              ? "default"
                              : m.status === "expired"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {m.status === "active"
                            ? "Activa"
                            : m.status === "expired"
                              ? "Vencida"
                              : m.status === "frozen"
                                ? "Congelada"
                                : "Cancelada"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin membresías registradas
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          {c.sales && (c.sales as unknown[]).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método de Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(c.sales as Record<string, unknown>[]).map(
                  (sale: Record<string, unknown>) => (
                    <TableRow key={sale.id as number}>
                      <TableCell>
                        {sale.receiptNumber as string}
                      </TableCell>
                      <TableCell>
                        {formatDate(sale.saleDate as string, "short")}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(sale.total as number)}
                      </TableCell>
                      <TableCell>
                        {sale.paymentMethod === "cash"
                          ? "Efectivo"
                          : sale.paymentMethod === "card"
                            ? "Tarjeta"
                            : sale.paymentMethod === "transfer"
                              ? "Transferencia"
                              : "Otro"}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin compras registradas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
