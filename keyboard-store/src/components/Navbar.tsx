import { useComparison } from '../context/comparison-context'
import { LANGUAGES, type Language, usePreferences } from '../context/preferences-context'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Sun, Moon, Languages } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { BRAND } from '../lib/format'
export default function Navbar(){
 const {ids}=useComparison()
 const {t,language,setLanguage,theme,setTheme}=usePreferences()

 const [open,setOpen]=useState(false), location=useLocation(), {lines}=useCart()
 const count=lines.reduce((n,l)=>n+l.quantity,0)
 return <><div className="announcement">{t("A better everyday starts at your fingertips.")}<span>{t("Thoughtfully selected. Built to feel different.")}</span></div><header><Link className="logo" to="/" aria-label={BRAND} onClick={()=>setOpen(false)}>{BRAND}<sup>®</sup></Link><nav id="main-navigation" aria-label={t("Main navigation")} className={open?'open':''} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);document.getElementById('menu-toggle')?.focus()}}}>{[['Compare products','/compare'],['Shop all','/products'],['Keyboards','/products?category=Keyboards'],['Keycaps','/products?category=Keycaps'],['Switches','/products?category=Switches']].map(([label,to])=><Link key={label} aria-current={location.pathname+location.search===to?'page':undefined} to={to} onClick={()=>setOpen(false)}>{t(label)}{to==='/compare'?' ('+ids.length+')':null}</Link>)}<a href="/#philosophy" onClick={()=>setOpen(false)}>{t("Our philosophy")}</a></nav><div className="header-actions"><div className="preferences-controls"><label className="language-control"><Languages size={16} aria-hidden="true"/><span className="sr-only">{t('Language')}</span><select aria-label={t('Language')} value={language} onChange={e=>setLanguage(e.target.value as Language)}>{LANGUAGES.map(l=><option key={l.id} value={l.id} lang={l.id}>{l.label}</option>)}</select></label><button className="theme-toggle" aria-label={t(theme==='dark'?'Switch to light mode':'Switch to dark mode')} title={t(theme==='dark'?'Switch to light mode':'Switch to dark mode')} onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button></div><Link className="bag" to="/cart" onClick={()=>setOpen(false)} aria-label={t('Shopping bag, {count} items',{count})}><ShoppingBag size={18}/><span className="bag-label" key={count}>{t("Bag (")}{count})</span></Link><button id="menu-toggle" className="menu-button" aria-label={t(open?'Close navigation':'Open navigation')} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header></>
}
