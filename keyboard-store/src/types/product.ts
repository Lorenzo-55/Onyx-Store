export type Category = 'Keyboards' | 'Barebones' | 'Switches' | 'Keycaps' | 'Accessories'

export interface Variant {
  id: string
  name: string
  color: string
  stock: number
  extra: number
}

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  detail: string
  description: string
  specs: Record<string, string>
  rating: number
  reviews: number
  color: string
  tag: string
  variants: Variant[]
  images: string[]
}

export interface CartLine {
  productId: string
  variantId: string
  quantity: number
}

export interface OrderLine {
  name: string
  variant: string
  quantity: number
  unitPrice: number
}

export interface DemoOrder {
  id: string
  lines: OrderLine[]
  subtotal: number
  shipping: number
  total: number
}
