import { createContext, useContext } from 'react'
import type { CartLine } from '../types/product'

export interface CartState {
  lines: CartLine[]
  notice: string
  add: (productId: string, variantId: string, quantity: number) => void
  setQuantity: (productId: string, variantId: string, quantity: number) => void
  clear: () => void
}

export const CartContext = createContext<CartState | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('CartProvider is required')
  return context
}
