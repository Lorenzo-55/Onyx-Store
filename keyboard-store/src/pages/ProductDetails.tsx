import CompareButton from '../components/CompareButton'
import ProductImage from '../components/ProductImage'
import { galleryOf, placeholderImageOf } from '../data/product-images'
import { usePreferences } from '../context/preferences-context'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, Minus, Plus, Check, Star } from 'lucide-react'
import { getProduct, priceOf, products, type Product } from '../data/products'
import { useCart } from '../context/cart-context'

import ProductCard from '../components/ProductCard'
export default function ProductDetails() {
 const {t}=usePreferences()

 const {id}=useParams(), product=getProduct(id||'')
 return product?<Details key={product.id} product={product}/>:<section className="section empty-state"><h1>{t("Product not found.")}</h1><p>{t("This piece is no longer in our collection.")}</p><Link className="button primary" to="/products">{t("Browse the collection →")}</Link></section>
}
function Details({product:p}:{product:Product}) {
 const {t,money}=usePreferences()

 const [params,setParams]=useSearchParams(), [view,setView]=useState(0), [quantity,setQuantity]=useState(1), [added,setAdded]=useState(false)
 const {add,lines}=useCart()
 const variant=p.variants.find(v=>v.id===params.get('variant'))||p.variants[0]
 const gallery=galleryOf(p.id,variant.id)
 const selectedView=Math.min(view,gallery.length-1)
 const selectedImage=gallery[selectedView]
 const already=lines.find(l=>l.productId===p.id&&l.variantId===variant.id)?.quantity||0
 const available=Math.max(0,variant.stock-already)
 const chosen=Math.min(quantity,Math.max(1,available))
 const related=products.filter(other=>other.id!==p.id&&other.category===p.category).slice(0,3)
 return <><section className="section detail-page"><nav className="breadcrumbs" aria-label={t("Breadcrumb")}><Link to="/products">{t("Collection")}</Link><span>/</span><Link to={`/products?category=${p.category}`}>{t(p.category)}</Link><span>/</span><span>{p.name}</span></nav><div className="detail-layout"><div className="gallery"><ProductImage className="gallery-main" src={selectedImage.src} fallbackSrc={placeholderImageOf(p.id,variant.id,selectedView)} width="640" height="440" alt={t('{name}, {variant} — {view}',{name:p.name,variant:t(variant.name),view:t(selectedImage.label)})}/><div className="gallery-thumbs">{gallery.map((image,n)=><button aria-label={t('Show image {number}: {view}',{number:n+1,view:t(image.label)})} aria-pressed={selectedView===n} className={selectedView===n?'active':''} onClick={()=>setView(n)} key={image.src}><ProductImage src={image.src} fallbackSrc={placeholderImageOf(p.id,variant.id,n)} alt="" width="100" height="69" loading="lazy"/></button>)}</div><p className="helper">{t(selectedImage.kind==='provided'?'Supplied product images. Products and specifications are fictional demo content.':'Original illustrative placeholders. All products and specifications are fictional demo content.')}</p></div><div className="product-info"><p className="eyebrow">{p.brand} / {t(p.category)}</p><h1>{p.name}</h1><p className="detail-rating"><Star size={15} fill="currentColor"/>{p.rating.toFixed(1)} <span>· {p.reviews} {t("sample ratings")}</span></p><p className="detail-price amount-update" key={variant.id}>{money(priceOf(p,variant))}</p><p className="description">{t(p.description)}</p><fieldset className="variant-picker"><legend>{t("Choose your")} {t(p.category==='Switches'?'weight':'finish')} <strong>{t(variant.name)}</strong></legend><div>{p.variants.map(v=><button className={v.id===variant.id?'active':''} aria-pressed={v.id===variant.id} key={v.id} onClick={()=>{setParams({variant:v.id},{replace:true});setQuantity(1);setView(0);setAdded(false)}}><i style={{background:v.color}}/>{t(v.name)}{v.extra>0?` (+${money(v.extra)})`:''}{v.stock===0?` · ${t('Sold out')}`:''}</button>)}</div></fieldset><p className={`stock ${variant.stock?'':'sold-out'}`}>{variant.stock?<><Check size={14}/>{variant.stock} {t("in mock stock")}{already?t(' · {count} already in your bag',{count:already}):''}</>:t('This variant is currently sold out.')}</p><div className="purchase-row"><div className="quantity"><button disabled={chosen<=1||!available} aria-label={t("Decrease quantity")} onClick={()=>setQuantity(chosen-1)}><Minus size={16}/></button><span className="quantity-value" key={chosen}>{chosen}</span><button disabled={chosen>=available} aria-label={t("Increase quantity")} onClick={()=>setQuantity(chosen+1)}><Plus size={16}/></button></div><button className={`button primary ${added?'is-added':''}`} disabled={!available} onClick={()=>{add(p.id,variant.id,chosen);setAdded(true)}}>{t(!variant.stock?'Sold out':!available?'All available stock in bag':added?'Added to bag':'Add to bag')}<ArrowRight size={18}/></button></div>{added&&<Link className="text-link added-link" to="/cart">{t("View your bag")} <ArrowRight size={16}/></Link>}<CompareButton product={p}/><p className="helper">{t("Free demo shipping from $150. No real purchases.")}</p></div></div><div className="specifications"><div><p className="eyebrow">{t("THE FINER DETAILS")}</p><h2>{t("Built with intention.")}</h2></div><dl>{Object.entries(p.specs).map(([key,value])=><div key={key}><dt>{t(key)}</dt><dd>{t(value)}</dd></div>)}</dl></div></section><section className="section related"><div className="section-heading"><h2>{t("Keep exploring.")}</h2><Link className="text-link" to={`/products?category=${p.category}`}>{t("View")} {t(p.category)} <ArrowRight size={16}/></Link></div><div className="product-grid">{related.map(p=><ProductCard product={p} key={p.id}/>)}</div></section></>
}
