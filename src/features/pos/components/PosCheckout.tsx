"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  Search,
} from "lucide-react"
import { useCartStore } from "@/src/store/cart-store"
import { usePosProducts, useCreateSale } from "@/src/features/pos/hooks/usePos"
import { useCurrency } from "@/src/hooks/useCurrency"
import { useDebounce } from "@/src/hooks/useDebounce"
import { PAYMENT_METHOD_OPTIONS } from "@/src/lib/constants"

export function PosCheckout() {
  const { formatValue } = useCurrency()
  const [search, setSearch] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [discountInput, setDiscountInput] = useState("0")
  const [notes, setNotes] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { items, addItem, removeItem, updateQuantity, setDiscount, clearCart } =
    useCartStore()
  const { data: productsData, isError: productsError, error: productsLoadError } = usePosProducts(debouncedSearch)
  const createSaleMutation = useCreateSale()

  const products = productsData?.data || []
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discount = Number(discountInput) || 0
  const total = Math.max(0, subtotal - discount)

  const handleAddProduct = (product: Record<string, unknown>) => {
    if (Number(product.stock ?? 0) <= 0) return

    addItem({
      productId: String(product.documentId ?? product.id),
      name: product.name as string,
      price: product.price as number,
      quantity: 1,
      stock: product.stock as number,
    })
  }

  const handleCheckout = () => {
    if (items.length === 0) return

    createSaleMutation.mutate({
      items: items.map((i) => ({
        product: i.productId,
        quantity: i.quantity,
        unitPrice: i.price,
        subtotal: i.price * i.quantity,
      })),
      total,
      discount,
      paymentMethod: paymentMethod as "cash" | "card" | "transfer" | "other",
      notes,
    })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Buscar Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {products.map((p: Record<string, unknown>) => (
            <Card
              key={String(p.documentId ?? p.id)}
              className={Number(p.stock ?? 0) > 0 ? "cursor-pointer hover:bg-accent transition-colors" : "opacity-60"}
              onClick={() => handleAddProduct(p)}
            >
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate">{p.name as string}</p>
                <p className="text-lg font-bold">{formatValue(p.price as number)}</p>
                <Badge variant={p.stock as number > 0 ? "default" : "destructive"} className="text-xs">
                  Stock: {p.stock as number}
                </Badge>
              </CardContent>
            </Card>
          ))}
          {productsError ? (
            <p className="col-span-full py-8 text-center text-destructive">Error al cargar productos: {productsLoadError instanceof Error ? productsLoadError.message : "intenta nuevamente"}</p>
          ) : products.length === 0 && !debouncedSearch && (
            <p className="col-span-full text-center py-8 text-muted-foreground">
              No hay productos activos
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Carrito ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Carrito vacío
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatValue(item.price)} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatValue(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm">Descuento</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={discountInput}
                onChange={(e) => {
                  setDiscountInput(e.target.value)
                  setDiscount(Number(e.target.value) || 0)
                }}
                className="w-24 h-8 text-right text-sm"
              />
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatValue(total)}</span>
            </div>

            <Select value={paymentMethod} onValueChange={(value) => value && setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger render={<Button className="flex-1" disabled={items.length === 0 || createSaleMutation.isPending}>{createSaleMutation.isPending ? "Procesando..." : "Cobrar"}</Button>} />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Venta</AlertDialogTitle>
                    <AlertDialogDescription>
                      Total: {formatValue(total)} - {items.length} producto(s)
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCheckout}>
                      Confirmar Venta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={items.length === 0}
              >
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
