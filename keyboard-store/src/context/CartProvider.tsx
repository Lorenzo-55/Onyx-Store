import { useEffect, useState, type ReactNode } from 'react'
import { usePreferences } from './preferences-context'
import { CartContext } from './cart-context'
import { CART_KEY, normalizeCart, setCartQuantity } from '../lib/cart'
import { getProduct, products } from '../data/products'
import type { CartLine } from '../types/product'
function readCart(): CartLine[] {
 try {
  const stored=localStorage.getItem(CART_KEY)
  if(stored!==null)return normalizeCart(JSON.parse(stored))
  const old:unknown=JSON.parse(localStorage.getItem('onyx-cart')||'{}')
  if(!old||typeof old!=='object')return []
  return normalizeCart(products.map(p=>({productId:p.id,variantId:p.variants[0].id,quantity:(old as Record<string,unknown>)[p.id]})))
 } catch {return []}
}
export default function CartProvider({children}:{children:ReactNode}) {
 const {t}=usePreferences()
 const [lines,setLines]=useState(readCart), [notice,setNotice]=useState('')
 useEffect(()=>{try{localStorage.setItem(CART_KEY,JSON.stringify(lines))}catch{/* In-memory cart remains usable. */}},[lines])
 useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key===CART_KEY){try{setLines(normalizeCart(JSON.parse(event.newValue||'[]')))}catch{setLines([])}}};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[])
 const add=(productId:string,variantId:string,quantity:number)=>{
  const p=getProduct(productId),v=p?.variants.find(v=>v.id===variantId)
  if(!p||!v||!v.stock)return
  setLines(old=>setCartQuantity(old,productId,variantId,(old.find(l=>l.productId===productId&&l.variantId===variantId)?.quantity||0)+quantity))
  setNotice(t('{product} · {variant} added to your bag. Quantities are limited to available stock.',{product:p.name,variant:t(v.name)}))
 }
 return <CartContext.Provider value={{lines,notice,add,setQuantity:(p,v,q)=>setLines(old=>setCartQuantity(old,p,v,q)),clear:()=>setLines([])}}>{children}</CartContext.Provider>
}
