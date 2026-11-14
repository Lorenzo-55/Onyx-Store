import ProductImage from '../components/ProductImage'
import { placeholderImageOf } from '../data/product-images'
import { usePreferences } from '../context/preferences-context'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { cartEntries, totals } from '../lib/cart'
import { imageOf } from '../data/products'

export function CartItems() {
 const {t,money}=usePreferences()

 const {lines,setQuantity}=useCart()
 return <div className="cart-items">{cartEntries(lines).map(l=><article className="cart-row" key={`${l.productId}:${l.variantId}`}><Link to={`/products/${l.productId}?variant=${l.variantId}`}><ProductImage fallbackSrc={placeholderImageOf(l.productId,l.variantId)} src={imageOf(l.product,l.variantId)} alt={l.product.name} width="160" height="110"/></Link><div className="cart-row-info"><Link to={`/products/${l.productId}?variant=${l.variantId}`}><h3>{l.product.name}</h3></Link><p>{t(l.variant.name)} · {money(l.unitPrice)} {t("each")}</p><div className="quantity"><button aria-label={t('Decrease {product} {variant} quantity',{product:l.product.name,variant:t(l.variant.name)})} onClick={()=>setQuantity(l.productId,l.variantId,l.quantity-1)}><Minus size={14}/></button><span className="quantity-value" key={l.quantity} aria-label={t("Quantity")}>{l.quantity}</span><button aria-label={t('Increase {product} {variant} quantity',{product:l.product.name,variant:t(l.variant.name)})} disabled={l.quantity>=l.variant.stock} onClick={()=>setQuantity(l.productId,l.variantId,l.quantity+1)}><Plus size={14}/></button></div></div><div className="line-end"><strong className="amount-update" key={l.quantity}>{money(l.unitPrice*l.quantity)}</strong><button className="remove-item" aria-label={t('Remove {product} {variant}',{product:l.product.name,variant:t(l.variant.name)})} onClick={()=>setQuantity(l.productId,l.variantId,0)}><Trash2 size={15}/> {t("Remove")}</button></div></article>)}</div>
}
export function OrderSummary({checkout=false}:{checkout?:boolean}) {
 const {t,money}=usePreferences()

 const {lines}=useCart(), total=totals(lines)
 return <aside className="order-summary"><p className="eyebrow">{t("THE DETAILS")}</p><h2>{t("Order summary")}</h2>{checkout&&cartEntries(lines).map(l=><div className="summary-line" key={`${l.productId}:${l.variantId}`}><span>{l.quantity} × {l.product.name}<small>{t(l.variant.name)}</small></span><span>{money(l.unitPrice*l.quantity)}</span></div>)}<div className="summary-line"><span>{t("Subtotal")}</span><span>{money(total.subtotal)}</span></div><div className="summary-line"><span>{t("Demo shipping")}</span><span>{total.shipping?money(total.shipping):t('Free')}</span></div><p className="helper">{t("Free demo shipping on orders of $150 or more. Otherwise $9. Prices are illustrative; no tax is collected.")}</p><div className="summary-line summary-total"><span>{t("Total")}</span><strong className="amount-update" key={total.total}>{money(total.total)}</strong></div>{!checkout&&<Link className="button primary" to="/checkout">{t("Continue to demo checkout")} <span>→</span></Link>}<p className="helper">{t("Portfolio demonstration. No real orders or payments.")}</p></aside>
}
export default function Cart() {
 const {t}=usePreferences()

 const {lines}=useCart()
 return <section className="section cart-page"><p className="eyebrow">{t("YOUR NEXT EVERYDAY")}</p><h1>{t("Your bag.")}</h1>{!lines.length?<div className="empty-state"><h2>{t("A little room for something good.")}</h2><p>{t("Your bag is empty. Find the piece that feels like you.")}</p><Link className="button primary" to="/products">{t("Explore the collection →")}</Link></div>:<div className="commerce-layout"><div><CartItems/><Link className="text-link" to="/products">{t("← Keep exploring")}</Link></div><OrderSummary/></div>}</section>
}
