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
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151a16] p-6 text-white shadow-2xl sm:p-8">
      <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#aeb4ac] transition hover:text-[#c8f169]"><ArrowLeft className="size-4" /> Volver al inicio</Link>
      <div className="mb-8"><div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#c8f169] text-[#0b0d0c]"><Dumbbell className="size-6" /></div><h1 className="text-3xl font-black tracking-tight">Bienvenido de nuevo.</h1><p className="mt-2 text-[#aeb4ac]">Ingresa tus credenciales para acceder.</p></div>
      <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField control={form.control} name="identifier" render={({ field }) => <FormItem><FormLabel className="text-[#d7ddd3]">Correo o Usuario</FormLabel><FormControl><Input placeholder="correo@ejemplo.com" autoComplete="email" className="border-[#3a403a] bg-[#202720] text-white placeholder:text-[#6f786d]" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel className="text-[#d7ddd3]">Contraseña</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" autoComplete="current-password" className="border-[#3a403a] bg-[#202720] text-white placeholder:text-[#6f786d]" {...field} /></FormControl><FormMessage /></FormItem>} />
        <Button type="submit" className="h-12 w-full rounded-full bg-[#c8f169] font-bold text-[#0b0d0c] hover:bg-white" disabled={loginMutation.isPending}>{loginMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}</Button>
      </form></Form>
      <p className="mt-7 text-center text-sm text-[#899087]">¿Nuevo gimnasio? <Link href="/signup" className="font-bold text-[#c8f169] hover:text-white">Crea una cuenta</Link></p>
    </div>
  )
}