import { useEffect, useState, type ReactNode } from 'react'
import { getProduct } from '../data/products'
import { COMPARISON_KEY, COMPARISON_LIMIT, ComparisonContext } from './comparison-context'

function readSelection(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(COMPARISON_KEY) || '[]')
    // Restore only distinct, known products within the comparison limit.
    return Array.isArray(saved)
      ? [
          ...new Set(
            saved.filter(
              (id): id is string => typeof id === 'string' && !!getProduct(id),
            ),
          ),
        ].slice(0, COMPARISON_LIMIT)
      : []
  } catch {
    return []
  }
}

export default function ComparisonProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(readSelection)
  useEffect(() => {
    try {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(ids))
    } catch {
      /* Selection remains available in memory. */
    }
  }, [ids])
  function toggle(id: string) {
    if (!getProduct(id)) return
    setIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : current.length < COMPARISON_LIMIT
          ? [...current, id]
          : current,
    )
  }
  return (
    <ComparisonContext.Provider value={{ ids, toggle, clear: () => setIds([]) }}>
      {children}
    </ComparisonContext.Provider>
  )
}
