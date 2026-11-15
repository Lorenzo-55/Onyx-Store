import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getProduct, imageOf, type Product } from '../data/products'
import { placeholderImageOf } from '../data/product-images'
import { useComparison } from '../context/comparison-context'
import { usePreferences } from '../context/preferences-context'
import ProductImage from '../components/ProductImage'

export default function Compare() {
  const { ids, toggle, clear } = useComparison()
  const { t, money } = usePreferences()
  const [differences, setDifferences] = useState(false)
  const selected = ids.map(getProduct).filter((p): p is Product => !!p)
  const specKeys = [...new Set(selected.flatMap((p) => Object.keys(p.specs)))]
  const rows: [string, (p: Product) => string][] = [
    ['Brand', (p) => p.brand],
    ['Category', (p) => t(p.category)],
    ['Starting price', (p) => money(p.price)],
    [
      'Availability',
      (p) => t(p.variants.some((v) => v.stock > 0) ? 'In stock' : 'Sold out'),
    ],
    [
      'Available options',
      (p) =>
        p.variants
          .map((v) => t(v.name) + (v.stock === 0 ? ' (' + t('Sold out') + ')' : ''))
          .join(', '),
    ],
    ...specKeys.map(
      (key) =>
        [key, (p: Product) => (p.specs[key] ? t(p.specs[key]) : t('Not applicable'))] as [
          string,
          (p: Product) => string,
        ],
    ),
  ]
  return (
    <section className="section compare-page">
      <p className="eyebrow">{t('SIDE BY SIDE')}</p>
      <h1>{t('Compare products')}</h1>
      <p className="compare-intro">
        {t(
          'Choose up to 3 products to find your fit. Prices shown are starting prices; options may cost more.',
        )}
      </p>
      <div className="compare-actions">
        <Link className="text-link" to="/products">
          {t('Shop all')}
        </Link>
        {selected.length > 0 && (
          <button className="compare-toggle" onClick={clear}>
            {t('Clear comparison')}
          </button>
        )}
      </div>
      {selected.length < 2 && (
        <p className="demo-banner">
          {t(
            selected.length === 0
              ? 'Your comparison is empty. Add products from the collection.'
              : 'Add one more product to compare specifications.',
          )}
        </p>
      )}
      {selected.length > 0 && (
        <>
          <label className="compare-filter">
            <input
              type="checkbox"
              checked={differences}
              disabled={selected.length < 2}
              onChange={(e) => setDifferences(e.target.checked)}
            />
            {t('Show differences only')}
          </label>
          <div
            className="compare-scroll"
            role="region"
            aria-label={t('Product comparison table')}
            tabIndex={0}
          >
            <table className="compare-table">
              <caption className="sr-only">{t('Product comparison table')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('Product')}</th>
                  {selected.map((p) => (
                    <th scope="col" key={p.id}>
                      <Link to={'/products/' + p.id}>
                        <ProductImage
                          src={imageOf(p)}
                          fallbackSrc={placeholderImageOf(p.id, p.variants[0].id)}
                          width="320"
                          height="220"
                          alt=""
                        />
                        <span>{p.name}</span>
                      </Link>
                      <button
                        className="compare-toggle"
                        aria-label={t('Remove {name} from comparison', { name: p.name })}
                        onClick={() => toggle(p.id)}
                      >
                        {t('Remove')}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter(
                    ([, value]) =>
                      !differences ||
                      selected.length < 2 ||
                      new Set(selected.map(value)).size > 1,
                  )
                  .map(([label, value]) => (
                    <tr key={label}>
                      <th scope="row">{t(label)}</th>
                      {selected.map((p) => (
                        <td key={p.id}>{value(p)}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
