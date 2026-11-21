import ComparisonProvider from './context/ComparisonProvider'
import Compare from './pages/Compare'
import SwitchSoundSimulator from './pages/SwitchSoundSimulator'
import { useScrollReveal } from './hooks/useScrollReveal'
import PreferencesProvider from './context/PreferencesProvider'
import { usePreferences } from './context/preferences-context'
import { useEffect, useRef } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import CartProvider from './context/CartProvider'
import { useCart } from './context/cart-context'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout, { OrderConfirmation } from './pages/Checkout'
import { getProduct } from './data/products'
import { BRAND } from './lib/format'
import './App.css'
import './motion.css'

function Store() {
  const { t } = usePreferences()

  const location = useLocation()
  const { notice } = useCart()
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  useScrollReveal(main, location.pathname)
  useEffect(() => {
    const path = location.pathname
    const page = path.startsWith('/products/')
      ? getProduct(path.split('/')[2])?.name || 'Product not found'
      : (
          {
            '/': 'Find your kind of click.',
            '/products': 'The collection',
            '/compare': 'Compare products',
            '/switch-simulator': 'Switch Sound Simulator',
            '/cart': 'Your bag',
            '/checkout': 'Demo checkout',
            '/order-confirmation': 'Demo order complete',
          } as Record<string, string>
        )[path] || 'Page not found'
    document.title = `${BRAND} — ${t(page)}`
  }, [location.pathname, t])
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
      main.current?.focus({ preventScroll: true })
    }
  }, [location.pathname, location.hash])
  return (
    <>
      <a className="skip" href="#main">
        {t('Skip to content')}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} ref={main}>
        <div className="page-transition" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Catalog />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/switch-simulator" element={<SwitchSoundSimulator />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route
              path="*"
              element={
                <section className="section empty-state">
                  <p className="eyebrow">{t('404 / OFF THE BEATEN PATH')}</p>
                  <h1>{t('Nothing here. Yet.')}</h1>
                  <p>{t("Let's find your way back to the good stuff.")}</p>
                  <Link className="button primary" to="/products">
                    {t('Explore the collection →')}
                  </Link>
                </section>
              }
            />
          </Routes>
        </div>
      </main>
      <Footer />
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <CartProvider>
          <ComparisonProvider>
            <Store />
          </ComparisonProvider>
        </CartProvider>
      </PreferencesProvider>
    </BrowserRouter>
  )
}
