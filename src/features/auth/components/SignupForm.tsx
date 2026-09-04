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
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151a16] p-6 text-white shadow-2xl sm:p-8">
      <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#aeb4ac] transition hover:text-[#c8f169]"><ArrowLeft className="size-4" /> Volver al inicio</Link>
      <div className="mb-8"><div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#c8f169] text-[#0b0d0c]"><Dumbbell className="size-6" /></div><h1 className="text-3xl font-black tracking-tight">Pon tu gym en marcha.</h1><p className="mt-2 text-[#aeb4ac]">Crea tu cuenta y empieza a ordenar tu operación.</p></div>
      <Form {...form}><form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5">
        <FormField control={form.control} name="gymName" render={({ field }) => <FormItem><FormLabel className="text-[#d7ddd3]">Nombre del gimnasio</FormLabel><FormControl><Input placeholder="Fuerza Central" autoComplete="organization" className="border-[#3a403a] bg-[#202720] text-white placeholder:text-[#6f786d]" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="username" render={({ field }) => <FormItem><FormLabel className="text-[#d7ddd3]">Nombre de usuario</FormLabel><FormControl><Input placeholder="mi-gym" autoComplete="username" className="border-[#3a403a] bg-[#202720] text-white placeholder:text-[#6f786d]" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel className="text-[#d7ddd3]">Correo electrónico</FormLabel><FormControl><Input type="email" placeholder="hola@migym.com" autoComplete="email" className="border-[#3a403a] bg-[#202720] text-white placeholder:text-[#6f786d]" {...field} /></FormControl><FormMessage /></FormItem>} />
        <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel className="text-[#d7ddd3]">Contraseña</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password" className="border-[#3a403a] bg-[#202720] text-white placeholder:text-[#6f786d]" {...field} /></FormControl><FormMessage /></FormItem>} />
        <Button type="submit" className="h-12 w-full rounded-full bg-[#c8f169] font-bold text-[#0b0d0c] hover:bg-white" disabled={registerMutation.isPending}>{registerMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} {registerMutation.isPending ? "Creando cuenta..." : "Crear mi cuenta"}</Button>
      </form></Form>
      <p className="mt-7 text-center text-sm text-[#899087]">¿Ya tienes una cuenta? <Link href="/login" className="font-bold text-[#c8f169] hover:text-white">Inicia sesión</Link></p>
    </div>
  )
}
