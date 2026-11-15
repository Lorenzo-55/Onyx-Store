import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { CART_KEY } from '../src/lib/cart'

function open(path: string, cart?: unknown) {
  window.history.replaceState({}, '', path)
  if (cart !== undefined) localStorage.setItem(CART_KEY, JSON.stringify(cart))
  return render(<App />)
}

const atlas = { productId: 'atlas', variantId: 'sand', quantity: 2 }

async function fillCheckout(user: ReturnType<typeof userEvent.setup>) {
  for (const [name, value] of [
    ['First name', 'Demo'],
    ['Last name', 'Tester'],
    ['Email address', 'demo@example.com'],
    ['Street address', '12 Sample Street'],
    ['City', 'Berlin'],
    ['Postal code', '10115'],
  ]) {
    await user.type(screen.getByRole('textbox', { name, exact: true }), value)
  }
  await user.click(screen.getByRole('checkbox'))
}

describe('shopping interface', () => {
  it('navigates from featured products to product details', async () => {
    const user = userEvent.setup()
    open('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Find your')
    await user.click(screen.getByRole('link', { name: 'Atlas 75', exact: true }))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Atlas 75' }),
    ).toBeInTheDocument()
    expect(document.title).toContain('Atlas 75')
  })
  it('filters, searches, sorts and resets the catalog', async () => {
    const user = userEvent.setup()
    open('/products')
    expect(screen.getAllByRole('article')).toHaveLength(18)
    await user.click(screen.getByRole('button', { name: 'Accessories', exact: true }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
    await user.selectOptions(screen.getByLabelText('Brand'), 'ØNYX')
    expect(screen.getAllByRole('article')).toHaveLength(1)
    await user.type(screen.getByRole('searchbox'), 'nothing')
    expect(screen.getByText('No matches just yet.')).toBeVisible()
    await user.click(screen.getAllByRole('button', { name: 'Reset filters' })[0])
    expect(screen.getAllByRole('article')).toHaveLength(18)
    await user.selectOptions(screen.getByLabelText('Sort by'), 'low')
    expect(screen.getAllByRole('article')[0]).toHaveTextContent('Essential Tool Kit')
    await user.type(screen.getByLabelText('Min price ($)'), '50')
    await user.type(screen.getByLabelText('Max price ($)'), '70')
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
  it('shows no results for contradictory prices and can recover', async () => {
    const user = userEvent.setup()
    open('/products?min=200&max=10')
    expect(screen.getByText('Minimum price must not exceed maximum price.')).toBeVisible()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
    await user.click(screen.getAllByRole('button', { name: 'Reset filters' })[0])
    expect(screen.getAllByRole('article')).toHaveLength(18)
  })
  it('selects a variant and quantity, persists them, and allows removal', async () => {
    const user = userEvent.setup()
    const app = open('/products/atlas')
    await user.click(screen.getByRole('button', { name: /Sand/ }))
    expect(screen.getByText('$194.00')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Add to bag' }))
    await user.click(screen.getByRole('link', { name: 'View your bag' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your bag')
    expect(screen.getByText('Sand · $194.00 each')).toBeVisible()
    expect(screen.getByText('$388.00', { selector: '.line-end strong' })).toBeVisible()
    expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual([atlas])
    app.unmount()
    open('/cart')
    expect(screen.getByText('Sand · $194.00 each')).toBeVisible()
    await user.click(
      screen.getByRole('button', { name: 'Remove Atlas 75 Sand', exact: true }),
    )
    expect(
      screen.getByText('Your bag is empty. Find the piece that feels like you.'),
    ).toBeVisible()
  })
  it('disables purchase of sold-out variants and stock beyond the bag limit', () => {
    const app = open('/products/pebble')
    expect(screen.getByRole('button', { name: 'Sold out', exact: true })).toBeDisabled()
    app.unmount()
    open('/products/atlas', [{ productId: 'atlas', variantId: 'sage', quantity: 12 }])
    expect(
      screen.getByRole('button', { name: 'All available stock in bag' }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()
  })
  it('recovers from a corrupted cart and migrates the first-version cart', () => {
    localStorage.setItem(CART_KEY, 'bad json')
    const app = open('/cart')
    expect(screen.getByText(/Your bag is empty/)).toBeVisible()
    app.unmount()
    localStorage.removeItem(CART_KEY)
    localStorage.setItem('onyx-cart', JSON.stringify({ atlas: 2, missing: 99 }))
    open('/cart')
    expect(screen.getByText('Sage · $189.00 each')).toBeVisible()
    expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual([
      { productId: 'atlas', variantId: 'sage', quantity: 2 },
    ])
  })
  it('syncs changes from another tab', async () => {
    open('/cart', [atlas])
    act(() =>
      window.dispatchEvent(
        new StorageEvent('storage', { key: CART_KEY, newValue: '[]' }),
      ),
    )
    expect(screen.getByText(/Your bag is empty/)).toBeVisible()
  })
  it('works when storage access is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const user = userEvent.setup()
    open('/products/atlas')
    await user.click(screen.getByRole('button', { name: 'Add to bag' }))
    await user.click(screen.getByRole('link', { name: 'View your bag' }))
    expect(screen.getByRole('heading', { name: 'Atlas 75', level: 3 })).toBeVisible()
  })
  it('shows helpful fallbacks for empty checkout, unknown routes and unknown products', () => {
    let app = open('/checkout')
    expect(screen.getByRole('heading', { name: 'Your bag is empty.' })).toBeVisible()
    app.unmount()
    app = open('/products/missing')
    expect(screen.getByRole('heading', { name: 'Product not found.' })).toBeVisible()
    app.unmount()
    open('/missing')
    expect(screen.getByText('404 / OFF THE BEATEN PATH')).toBeVisible()
  })
  it('opens and closes the mobile navigation with accessible state', async () => {
    const user = userEvent.setup()
    open('/')
    const button = screen.getByRole('button', { name: 'Open navigation' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.click(button)
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await user.click(screen.getByRole('link', { name: 'Shop all', exact: true }))
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'The collection.' }),
    ).toBeInTheDocument()
  })
})

describe('demo checkout', () => {
  it('shows validation errors, focuses the first invalid field and keeps the cart', async () => {
    const user = userEvent.setup()
    open('/checkout', [atlas])
    await user.click(screen.getByRole('button', { name: 'Place demo order' }))
    await waitFor(() => expect(screen.getByLabelText('First name')).toHaveFocus())
    expect(screen.getByRole('alert')).toHaveTextContent('highlighted fields')
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
    expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual([atlas])
  })
  it('completes a demo order, clears the cart, retains a receipt and discards personal fields', async () => {
    const user = userEvent.setup()
    open('/checkout', [atlas])
    await fillCheckout(user)
    await user.click(screen.getByRole('button', { name: 'Place demo order' }))
    expect(screen.getByText('Your demo order is complete.')).toBeVisible()
    expect(screen.getByText('2 × Atlas 75')).toBeVisible()
    expect(
      within(screen.getByText('Demo total').parentElement!).getByText('$388.00'),
    ).toBeVisible()
    expect(JSON.parse(localStorage.getItem(CART_KEY)!)).toEqual([])
    expect(sessionStorage.getItem('onyx-demo-receipt')).not.toContain('demo@example.com')
    expect(sessionStorage.getItem('onyx-demo-receipt')).not.toContain('Sample Street')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Shopping bag, 0 items' })).toBeVisible()
  })
  it('restores a receipt after reload and safely handles malformed session data', () => {
    sessionStorage.setItem(
      'onyx-demo-receipt',
      JSON.stringify({
        id: 'DEMO-TEST',
        lines: [{ name: 'Atlas 75', variant: 'Sand', quantity: 2, unitPrice: 194 }],
        subtotal: 388,
        shipping: 0,
        total: 388,
      }),
    )
    const app = open('/order-confirmation')
    expect(screen.getByText('DEMO-TEST')).toBeVisible()
    app.unmount()
    sessionStorage.setItem('onyx-demo-receipt', '{"id":"oops"}')
    open('/order-confirmation')
    expect(screen.getByRole('heading', { name: 'No demo order yet.' })).toBeVisible()
  })
  it('uses the current order instead of a stale receipt when session writes fail', async () => {
    sessionStorage.setItem(
      'onyx-demo-receipt',
      JSON.stringify({
        id: 'DEMO-OLD',
        lines: [{ name: 'Old item', variant: 'Old', quantity: 1, unitPrice: 19 }],
        subtotal: 19,
        shipping: 9,
        total: 28,
      }),
    )
    const original = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key: string,
      value: string,
    ) {
      if (key === 'onyx-demo-receipt') throw new Error('Quota')
      return original.call(this, key, value)
    })
    const user = userEvent.setup()
    open('/checkout', [atlas])
    await fillCheckout(user)
    await user.click(screen.getByRole('button', { name: 'Place demo order' }))
    expect(screen.getByText('2 × Atlas 75')).toBeVisible()
    expect(screen.queryByText('DEMO-OLD')).not.toBeInTheDocument()
  })
})

describe('receipt navigation fallbacks', () => {
  it('ignores invalid browser history state instead of crashing', () => {
    window.history.replaceState(
      { usr: { id: 'DEMO-BROKEN', lines: null } },
      '',
      '/order-confirmation',
    )
    render(<App />)
    expect(screen.getByRole('heading', { name: 'No demo order yet.' })).toBeVisible()
  })
  it('completes checkout when all browser storage writes are blocked', async () => {
    const user = userEvent.setup()
    open('/checkout', [atlas])
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    await fillCheckout(user)
    await user.click(screen.getByRole('button', { name: 'Place demo order' }))
    expect(screen.getByText('Your demo order is complete.')).toBeVisible()
    expect(screen.getByText('2 × Atlas 75')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Shopping bag, 0 items' })).toBeVisible()
  })
})
