"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/src/services/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

const settingsSchema = z.object({
  gymName: z.string().min(1, "El nombre es requerido"),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  currency: z.string(),
  receiptFooter: z.string(),
  defaultMembershipDuration: z.string(),
  lowStockThreshold: z.string(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/setting")
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (formData: SettingsFormValues) => {
      await api.put("/setting", {
        data: {
          gymName: formData.gymName,
          address: formData.address || "",
          phone: formData.phone || "",
          email: formData.email || "",
          currency: formData.currency || "MXN",
          receiptFooter: formData.receiptFooter || "",
          defaultMembershipDuration: Number(formData.defaultMembershipDuration || 30),
          lowStockThreshold: Number(formData.lowStockThreshold || 5),
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast.success("Configuración guardada")
    },
    onError: () => {
      toast.error("Error al guardar la configuración")
    },
  })

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      gymName: "",
      address: "",
      phone: "",
      email: "",
      currency: "MXN",
      receiptFooter: "",
      defaultMembershipDuration: "30",
      lowStockThreshold: "5",
    },
  })

  const settings = data?.data?.attributes || data?.data || {}

  useEffect(() => {
    if (settings && settings.gymName) {
      form.reset({
        gymName: settings.gymName || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        currency: settings.currency || "MXN",
        receiptFooter: settings.receiptFooter || "",
        defaultMembershipDuration: String(settings.defaultMembershipDuration || 30),
        lowStockThreshold: String(settings.lowStockThreshold || 5),
      })
    }
  }, [settings, form])

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const onSubmit = (values: SettingsFormValues) => {
    mutation.mutate(values)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración general del gimnasio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Gimnasio</CardTitle>
          <CardDescription>
            Datos generales que aparecerán en facturas y reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
            name="gymName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Gimnasio</FormLabel>
                      <FormControl>
                        <Input placeholder="Mi Gimnasio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <FormControl>
                        <Input placeholder="MXN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@gimnasio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección del gimnasio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultMembershipDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración por Defecto (días)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Mínimo (alerta)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiptFooter"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Pie de Recibo</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[80px]" placeholder="Gracias por su preferencia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Configuración
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
