"use client"

import { cn } from "@/lib/utils"
import { Sidebar } from "@/src/components/layout/Sidebar"
import { Header } from "@/src/components/layout/Header"
import { useUiStore } from "@/src/store/ui-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebar = useUiStore((state) => state.sidebar)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={cn("flex min-w-0 flex-1 flex-col transition-[padding] duration-300", sidebar === "expanded" ? "md:pl-64" : "md:pl-16")}>
        <Header />
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
