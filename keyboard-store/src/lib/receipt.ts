import type { DemoOrder, OrderLine } from '../types/product'

export const RECEIPT_KEY = 'onyx-demo-receipt'

export function validateReceipt(value: unknown): DemoOrder | null {
  if (!value || typeof value !== 'object') return null
  const r = value as Record<string, unknown>
  if (
    typeof r.id !== 'string' ||
    !/^DEMO-[A-Z0-9-]+$/.test(r.id) ||
    !Array.isArray(r.lines) ||
    !r.lines.length
  )
    return null
  const lines: OrderLine[] = []
  for (const raw of r.lines) {
    if (!raw || typeof raw !== 'object') return null
    const l = raw as Record<string, unknown>
    if (
      typeof l.name !== 'string' ||
      typeof l.variant !== 'string' ||
      typeof l.quantity !== 'number' ||
      !Number.isSafeInteger(l.quantity) ||
      l.quantity <= 0 ||
      typeof l.unitPrice !== 'number' ||
      !Number.isFinite(l.unitPrice) ||
      l.unitPrice < 0
    )
      return null
    lines.push({
      name: l.name,
      variant: l.variant,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
    })
  }
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)
  const shipping = subtotal >= 150 ? 0 : 9
  if (
    !Number.isFinite(subtotal) ||
    r.subtotal !== subtotal ||
    r.shipping !== shipping ||
    r.total !== subtotal + shipping
  )
    return null
  return { id: r.id, lines, subtotal, shipping, total: subtotal + shipping }
}
