"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Dumbbell, Loader2 } from "lucide-react"
import { useRegister } from "@/src/features/auth/hooks/useRegister"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const signupSchema = z.object({
  gymName: z.string().min(2, "El nombre del gimnasio debe tener al menos 2 caracteres"),
  username: z.string().min(2, "El usuario debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const registerMutation = useRegister()
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { gymName: "", username: "", email: "", password: "" },
  })

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
      <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"><ArrowLeft className="size-4" /> Volver al inicio</Link>
      <div className="mb-8"><div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Dumbbell className="size-6" /></div><h1 className="text-3xl font-black tracking-tight">Pon tu gym en marcha.</h1><p className="mt-2 text-muted-foreground">Crea tu cuenta y empieza a ordenar tu operación.</p></div>
      <Form {...form}><form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5">
        <FormField control={form.control} name="gymName" render={({ field }) => <FormItem><FormLabel>Nombre del gimnasio</FormLabel><FormControl><Input placeholder="Fuerza Central" autoComplete="organization" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="username" render={({ field }) => <FormItem><FormLabel>Nombre de usuario</FormLabel><FormControl><Input placeholder="mi-gym" autoComplete="username" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Correo electrónico</FormLabel><FormControl><Input type="email" placeholder="hola@migym.com" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password" {...field} /></FormControl><FormMessage /></FormItem>} />
        <Button type="submit" className="h-12 w-full rounded-full font-bold" disabled={registerMutation.isPending}>{registerMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} {registerMutation.isPending ? "Creando cuenta..." : "Crear mi cuenta"}</Button>
      </form></Form>
      <p className="mt-7 text-center text-sm text-muted-foreground">¿Ya tienes una cuenta? <Link href="/login" className="font-bold text-primary hover:underline">Inicia sesión</Link></p>
    </div>
  )
}