"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLogin } from "@/src/features/auth/hooks/useLogin"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Dumbbell, Loader2 } from "lucide-react"
import Link from "next/link"

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "El correo o usuario es requerido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data)
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
      <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"><ArrowLeft className="size-4" /> Volver al inicio</Link>
      <div className="mb-8"><div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Dumbbell className="size-6" /></div><h1 className="text-3xl font-black tracking-tight">Bienvenido de nuevo.</h1><p className="mt-2 text-muted-foreground">Ingresa tus credenciales para acceder.</p></div>
      <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField control={form.control} name="identifier" render={({ field }) => <FormItem><FormLabel>Correo o Usuario</FormLabel><FormControl><Input placeholder="correo@ejemplo.com" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" autoComplete="current-password" {...field} /></FormControl><FormMessage /></FormItem>} />
        <Button type="submit" className="h-12 w-full rounded-full font-bold" disabled={loginMutation.isPending}>{loginMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}</Button>
      </form></Form>
      <p className="mt-7 text-center text-sm text-muted-foreground">¿Nuevo gimnasio? <Link href="/signup" className="font-bold text-primary hover:underline">Crea una cuenta</Link></p>
    </div>
  )
}