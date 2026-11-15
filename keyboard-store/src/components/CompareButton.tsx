import { useComparison, COMPARISON_LIMIT } from '../context/comparison-context'
import { usePreferences } from '../context/preferences-context'
import type { Product } from '../types/product'

export default function CompareButton({ product }: { product: Product }) {
  const { ids, toggle } = useComparison()
  const { t } = usePreferences()
  const selected = ids.includes(product.id)
  const full = ids.length >= COMPARISON_LIMIT && !selected
  return (
    <button
      className="compare-toggle"
      aria-pressed={selected}
      aria-label={t(selected ? 'Remove {name} from comparison' : 'Compare {name}', {
        name: product.name,
      })}
      disabled={full}
      onClick={() => toggle(product.id)}
    >
      {t(
        selected
          ? 'Selected for comparison'
          : full
            ? 'Comparison full (3)'
            : 'Compare product',
      )}
    </button>
  )
}
