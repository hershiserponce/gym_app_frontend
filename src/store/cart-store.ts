import { create } from "zustand"

export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  stock: number
}

type CartState = {
  items: CartItem[]
  discount: number
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setDiscount: (discount: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  discount: 0,
  addItem: (item) => {
    const items = get().items
    const existing = items.find((i) => i.productId === item.productId)
    if (existing) {
      set({
        items: items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.stock, i.quantity + item.quantity) }
            : i
        ),
      })
    } else {
      set({
        items: [
          ...items,
          { ...item, id: crypto.randomUUID() },
        ],
      })
    }
  },
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(i.stock, Math.max(1, quantity)) } : i
      ),
    })),
  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  clearCart: () => set({ items: [], discount: 0 }),
  getTotal: () => {
    const { items, discount } = get()
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return Math.max(0, subtotal - discount)
  },
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
