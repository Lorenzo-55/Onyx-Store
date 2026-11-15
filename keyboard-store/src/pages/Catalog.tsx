import { usePreferences } from '../context/preferences-context'
import { useSearchParams } from 'react-router-dom'
import { categories, products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const { t } = usePreferences()

  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'All'
  const brand = params.get('brand') || 'All'
  const query = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  const min = Math.max(0, Number(params.get('min')) || 0)
  const max = params.get('max') ? Math.max(0, Number(params.get('max')) || 0) : 300
  const update = (key: string, value: string) =>
    setParams(
      (old) => {
        const next = new URLSearchParams(old)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  const shown = products
    .filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (brand === 'All' || p.brand === brand) &&
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        p.price >= min &&
        p.price <= max &&
        (!params.has('stock') || p.variants.some((v) => v.stock > 0)),
    )
    .sort((a, b) =>
      sort === 'low'
        ? a.price - b.price
        : sort === 'high'
          ? b.price - a.price
          : sort === 'az'
            ? a.name.localeCompare(b.name)
            : sort === 'za'
              ? b.name.localeCompare(a.name)
              : 0,
    )
  return (
    <section className="section catalog">
      <p className="eyebrow">{t('FIND YOUR FEEL')}</p>
      <h1>{t('The collection.')}</h1>
      <p>{t('Considered essentials for your everyday setup.')}</p>
      <div className="catalog-tools">
        <div className="filters" aria-label={t('Product categories')}>
          {['All', ...categories].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? 'selected' : ''}
              onClick={() => update('category', c === 'All' ? '' : c)}
            >
              {t(c)}
            </button>
          ))}
        </div>
        <label className="search-label">
          {t('Search')}
          <input
            type="search"
            aria-label={t('Search products')}
            value={query}
            onChange={(e) => update('q', e.target.value)}
            placeholder={t('Find your next daily driver…')}
          />
        </label>
      </div>
      <div className="filter-bar">
        <label>
          {t('Brand')}
          <select
            value={brand}
            onChange={(e) =>
              update('brand', e.target.value === 'All' ? '' : e.target.value)
            }
          >
            <option value="All">{t('All')}</option>
            {[...new Set(products.map((p) => p.brand))].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          {t('Min price ($)')}
          <input
            type="number"
            min="0"
            max="300"
            value={params.get('min') || ''}
            placeholder="0"
            onChange={(e) => update('min', e.target.value)}
          />
        </label>
        <label>
          {t('Max price ($)')}
          <input
            type="number"
            min="0"
            max="300"
            value={params.get('max') || ''}
            placeholder="300"
            onChange={(e) => update('max', e.target.value)}
          />
        </label>
        <label>
          {t('Sort by')}
          <select value={sort} onChange={(e) => update('sort', e.target.value)}>
            <option value="featured">{t('Featured')}</option>
            <option value="low">{t('Price: low to high')}</option>
            <option value="high">{t('Price: high to low')}</option>
            <option value="az">{t('Name: A to Z')}</option>
            <option value="za">{t('Name: Z to A')}</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={params.has('stock')}
            onChange={(e) => update('stock', e.target.checked ? 'yes' : '')}
          />{' '}
          {t('In stock only')}
        </label>
        <button className="reset-filters" onClick={() => setParams({})}>
          {t('Reset filters')}
        </button>
      </div>
      <p className="results" role="status">
        {shown.length} {t('products · Sample catalog and ratings')}
      </p>
      {min > max && (
        <p className="form-error">{t('Minimum price must not exceed maximum price.')}</p>
      )}
      <div className="product-grid" key={shown.map((p) => p.id).join('|')}>
        {shown.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state">
          <h2>{t('No matches just yet.')}</h2>
          <p>{t('Try another search or reset your filters.')}</p>
          <button className="button secondary" onClick={() => setParams({})}>
            {t('Reset filters')}
          </button>
        </div>
      )}
    </section>
  )
}
