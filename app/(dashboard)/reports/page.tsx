"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { paymentsService } from "@/src/services/payments"
import { salesService } from "@/src/services/sales"
import { clientsService } from "@/src/services/clients"
import { formatDate } from "@/src/utils/formatters"
import { useTenantId } from "@/src/hooks/useTenantId"
import { useCurrency } from "@/src/hooks/useCurrency"

function formatDateForApi(date: Date): string {
  return date.toISOString().split("T")[0]
}

export default function ReportsPage() {
  const { formatValue } = useCurrency()
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const [dateFrom, setDateFrom] = useState(formatDateForApi(firstDay))
  const [dateTo, setDateTo] = useState(formatDateForApi(today))
  const [activeTab, setActiveTab] = useState("payments")
  const gymId = useTenantId()

  const { data: paymentsData } = useQuery({
    queryKey: ["reports-payments", gymId, dateFrom, dateTo],
    queryFn: () =>
      paymentsService.list({
        pagination: { pageSize: 100 },
        filters: {
          paymentDate: {
            $gte: `${dateFrom}T00:00:00.000Z`,
            $lte: `${dateTo}T23:59:59.999Z`,
          },
        },
        populate: "client,membership",
      }),
    enabled: gymId !== null,
  })

  const { data: salesData } = useQuery({
    queryKey: ["reports-sales", gymId, dateFrom, dateTo],
    queryFn: () =>
      salesService.list({
        pagination: { pageSize: 100 },
        filters: {
          saleDate: {
            $gte: `${dateFrom}T00:00:00.000Z`,
            $lte: `${dateTo}T23:59:59.999Z`,
          },
        },
        populate: "client,items",
      }),
    enabled: gymId !== null,
  })

  const { data: clientsData } = useQuery({
    queryKey: ["reports-clients", gymId, dateFrom, dateTo],
    queryFn: () =>
      clientsService.list({
        pagination: { pageSize: 100 },
        filters: {
          registrationDate: {
            $gte: `${dateFrom}T00:00:00.000Z`,
            $lte: `${dateTo}T23:59:59.999Z`,
          },
        },
      }),
    enabled: gymId !== null,
  })

  const payments = paymentsData?.data || []
  const sales = salesData?.data || []
  const newClients = clientsData?.data || []

  const totalPayments = payments.reduce(
    (sum: number, p: Record<string, unknown>) => sum + (p.amount as number),
    0
  )
  const totalSales = sales.reduce(
    (sum: number, s: Record<string, unknown>) => sum + (s.total as number),
    0
  )
  const totalRevenue = totalPayments + totalSales

  const handleExportCSV = (type: string) => {
    let csv = ""
    let filename = ""

    if (type === "payments") {
      csv = "Recibo,Cliente,Membresía,Monto,Método,Fecha\n"
      payments.forEach((p: Record<string, unknown>) => {
        csv += `${p.receiptNumber || ""},${(p.client as Record<string, unknown>)?.fullName || "N/A"},${(p.membership as Record<string, unknown>)?.name || "N/A"},${p.amount},${p.paymentMethod},${p.paymentDate}\n`
      })
      filename = "pagos.csv"
    } else if (type === "sales") {
      csv = "Folio,Cliente,Total,Método,Fecha\n"
      sales.forEach((s: Record<string, unknown>) => {
        csv += `${s.receiptNumber || ""},${(s.client as Record<string, unknown>)?.fullName || "Mostrador"},${s.total},${s.paymentMethod},${s.saleDate}\n`
      })
      filename = "ventas.csv"
    } else {
      csv = "Nombre,Correo,Teléfono,Estado,Fecha de Registro\n"
      newClients.forEach((c: Record<string, unknown>) => {
        csv += `${c.fullName},${c.email},${c.phone},${c.status},${c.registrationDate}\n`
      })
      filename = "clientes.csv"
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-description">
            Visualiza y exporta los datos del gimnasio
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Desde</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Hasta</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos por Membresías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatValue(totalPayments)}</p>
            <p className="text-xs text-muted-foreground">
              {payments.length} pago(s)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos por Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatValue(totalSales)}</p>
            <p className="text-xs text-muted-foreground">
              {sales.length} venta(s)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Nuevos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{newClients.length}</p>
            <p className="text-xs text-muted-foreground">registro(s)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingreso Total</CardTitle>
          <CardDescription>
            Del {dateFrom} al {dateTo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatValue(totalRevenue)}</p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="clients">Clientes Nuevos</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => handleExportCSV("payments")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Cliente</th>
                  <th className="p-2 text-left">Membresía</th>
                  <th className="p-2 text-right">Monto</th>
                  <th className="p-2 text-left">Método</th>
                  <th className="p-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: Record<string, unknown>) => (
                  <tr key={p.id as number} className="border-b">
                    <td className="p-2">{(p.client as Record<string, unknown>)?.fullName as string}</td>
                    <td className="p-2">{(p.membership as Record<string, unknown>)?.name as string}</td>
                    <td className="p-2 text-right font-medium">{formatValue(p.amount as number)}</td>
                    <td className="p-2">{p.paymentMethod as string}</td>
                    <td className="p-2">{formatDate(p.paymentDate as string, "short")}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Sin datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => handleExportCSV("sales")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Folio</th>
                  <th className="p-2 text-left">Cliente</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-left">Método</th>
                  <th className="p-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s: Record<string, unknown>) => (
                  <tr key={s.id as number} className="border-b">
                    <td className="p-2 font-mono">{s.receiptNumber as string}</td>
                    <td className="p-2">{(s.client as Record<string, unknown>)?.fullName as string || "Mostrador"}</td>
                    <td className="p-2 text-right font-medium">{formatValue(s.total as number)}</td>
                    <td className="p-2">{s.paymentMethod as string}</td>
                    <td className="p-2">{formatDate(s.saleDate as string, "short")}</td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Sin datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => handleExportCSV("clients")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Correo</th>
                  <th className="p-2 text-left">Teléfono</th>
                  <th className="p-2 text-left">Estado</th>
                  <th className="p-2 text-left">Registro</th>
                </tr>
              </thead>
              <tbody>
                {newClients.map((c: Record<string, unknown>) => (
                  <tr key={c.id as number} className="border-b">
                    <td className="p-2 font-medium">{c.fullName as string}</td>
                    <td className="p-2">{c.email as string}</td>
                    <td className="p-2">{c.phone as string}</td>
                    <td className="p-2">{c.status as string}</td>
                    <td className="p-2">{formatDate(c.registrationDate as string, "short")}</td>
                  </tr>
                ))}
                {newClients.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Sin datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
