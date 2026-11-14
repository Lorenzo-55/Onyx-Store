import { getProduct, priceOf } from '../data/products.ts'
import type { CartLine, DemoOrder } from '../types/product.ts'
export const CART_KEY = 'onyx-cart-v2'
export function normalizeCart(value: unknown): CartLine[] {
 if (!Array.isArray(value)) return []
 const lines: CartLine[] = []
 for (const raw of value) {
  if (!raw || typeof raw !== 'object') continue
  const { productId, variantId, quantity } = raw
  if (typeof productId !== 'string' || typeof variantId !== 'string' || typeof quantity !== 'number' || !Number.isFinite(quantity)) continue
  const p = getProduct(productId), v = p?.variants.find(v=>v.id===variantId)
  if (!p || !v || v.stock===0 || quantity<1) continue
  const existing = lines.find(l=>l.productId===productId&&l.variantId===variantId)
  const capped = Math.min(v.stock, Math.floor(quantity)+(existing?.quantity||0))
  if (existing) existing.quantity=capped
  else lines.push({productId,variantId,quantity:capped})
 }
 return lines
}
export function setCartQuantity(lines: CartLine[], productId: string, variantId: string, quantity: number): CartLine[] {
 return normalizeCart([...lines.filter(l=>l.productId!==productId||l.variantId!==variantId),{productId,variantId,quantity}])
}
export function cartEntries(lines: CartLine[]) {
 return normalizeCart(lines).flatMap(line=>{
  const product=getProduct(line.productId)!, variant=product.variants.find(v=>v.id===line.variantId)!
  return [{...line,product,variant,unitPrice:priceOf(product,variant)}]
 })
}
export function totals(lines: CartLine[]) {
 const subtotal=cartEntries(lines).reduce((n,l)=>n+l.unitPrice*l.quantity,0)
 const shipping=subtotal===0||subtotal>=150?0:9
 return {subtotal,shipping,total:subtotal+shipping}
}
export function createDemoOrder(lines: CartLine[], id: string): DemoOrder {
 const entries=cartEntries(lines)
 if (!entries.length) throw new Error('Your bag is empty.')
 return {id,lines:entries.map(l=>({name:l.product.name,variant:l.variant.name,quantity:l.quantity,unitPrice:l.unitPrice})),...totals(lines)}
}
