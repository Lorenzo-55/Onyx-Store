import ProductImage from './ProductImage'
import { placeholderImageOf } from '../data/product-images'
import { usePreferences } from '../context/preferences-context'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { imageOf, type Product } from '../data/products'

export default function ProductCard({product:p}:{product:Product}) {
 const {t,money}=usePreferences()

 const inStock=p.variants.some(v=>v.stock>0)
 return <article className="product"><Link className={`product-image ${p.color}`} to={`/products/${p.id}`}><span className="product-tag">{t(inStock?p.tag:'Sold out')}</span><ProductImage fallbackSrc={placeholderImageOf(p.id,p.variants[0].id)} src={imageOf(p)} width="640" height="440" loading="lazy" alt={t('{name} — product image',{name:p.name})}/><span className="quick-add" aria-hidden="true"><ArrowRight size={17}/></span></Link><div className="product-title"><h3><Link to={`/products/${p.id}`}>{p.name}</Link></h3><span>{money(p.price)}</span></div><p>{p.brand} · {t(p.detail)}</p><p className="rating">★ {p.rating.toFixed(1)} <span>({p.reviews} {t("sample ratings)")}</span></p></article>
}
