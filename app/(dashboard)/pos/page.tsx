"use client"

import { PosCheckout } from "@/src/features/pos/components/PosCheckout"

export default function PosPage() {
  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Punto de Venta</h1>
        <p className="page-description">Registra ventas y gestiona el carrito.</p>
      </div>
      <PosCheckout />
    </div>
  )
}
