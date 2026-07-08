"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import type { MembershipFormData } from "@/src/features/memberships/types"

const membershipSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  duration: z.number().min(1, "La duración debe ser al menos 1 día"),
  benefits: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean(),
})

type MembershipFormValues = z.infer<typeof membershipSchema>

type MembershipFormProps = {
  defaultValues?: Partial<MembershipFormValues>
  onSubmit: (data: MembershipFormValues) => void
  isPending: boolean
  onCancel?: () => void
}

export function MembershipForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
}: MembershipFormProps) {
  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      benefits: "",
      color: "#3b82f6",
      sortOrder: 0,
      isActive: true,
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Membresía Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (días)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 p-1" {...field} />
                    <Input
                      placeholder="#3b82f6"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-6">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Activa</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción de la membresía..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="benefits"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Beneficios</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Lista de beneficios incluidos..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe los beneficios que incluye esta membresía
                </FormDescription>
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
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}
