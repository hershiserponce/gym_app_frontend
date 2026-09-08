"use client"

import { ThemeProvider } from "next-themes"
import { QueryProvider } from "@/src/providers/query-provider"
import { AuthProvider } from "@/src/providers/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}