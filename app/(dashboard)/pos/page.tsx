"use client"

import { PosCheckout } from "@/src/features/pos/components/PosCheckout"

export default function PosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Punto de Venta</h1>
      </div>
      <PosCheckout />
    </div>
  )
}
