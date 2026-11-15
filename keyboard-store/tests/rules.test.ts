import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { products, categories } from '../src/data/products'
import { normalizeCart, setCartQuantity, totals, createDemoOrder } from '../src/lib/cart'
import { validateCheckout, type CheckoutFields } from '../src/lib/checkout'

const line = { productId: 'atlas', variantId: 'sage', quantity: 1 }

const valid: CheckoutFields = {
  firstName: 'Demo',
  lastName: 'Tester',
  email: 'demo@example.com',
  address: '12 Sample Street',
  apartment: '',
  city: 'Berlin',
  region: '',
  postal: '10115',
  country: 'Germany',
  demoConsent: true,
}

describe('catalog integrity', () => {
  it('contains 15–20 unique products covering all five categories', () => {
    expect(products.length).toBeGreaterThanOrEqual(15)
    expect(products.length).toBeLessThanOrEqual(20)
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length)
    expect(new Set(products.map((p) => p.category))).toEqual(new Set(categories))
  })
  it('has valid variant stock, ratings, prices and complete local galleries', () => {
    for (const p of products) {
      expect(p.price).toBeGreaterThan(0)
      expect(p.rating).toBeGreaterThanOrEqual(1)
      expect(p.rating).toBeLessThanOrEqual(5)
      expect(p.description.length).toBeGreaterThan(40)
      expect(Object.keys(p.specs).length).toBeGreaterThan(3)
      expect(new Set(p.variants.map((v) => v.id)).size).toBe(p.variants.length)
      for (const v of p.variants) {
        expect(Number.isInteger(v.stock)).toBe(true)
        expect(v.stock).toBeGreaterThanOrEqual(0)
      }
      for (const img of p.images) {
        expect(existsSync(`public${img}`), img).toBe(true)
      }
    }
  })
})

describe('cart and order rules', () => {
  it('recovers safely from invalid persisted data', () => {
    for (const bad of [null, {}, 'bad', 2]) {
      expect(normalizeCart(bad)).toEqual([])
    }
    expect(
      normalizeCart([
        null,
        {},
        { ...line, productId: 'missing' },
        { ...line, variantId: 'invalid' },
        { ...line, quantity: NaN },
        { ...line, quantity: Infinity },
        { ...line, quantity: -1 },
        { ...line, quantity: '2' },
      ]),
    ).toEqual([])
  })
  it('merges duplicates, caps stock and removes sold-out lines', () => {
    expect(
      normalizeCart([
        { ...line, quantity: 9 },
        { ...line, quantity: 10 },
        { productId: 'pebble', variantId: 'smoke', quantity: 1 },
      ]),
    ).toEqual([{ ...line, quantity: 12 }])
  })
  it('keeps variants separate and removes a zero quantity', () => {
    const cart = [line, { ...line, variantId: 'sand', quantity: 2 }]
    expect(setCartQuantity(cart, 'atlas', 'sage', 0)).toEqual([cart[1]])
    expect(setCartQuantity(cart, 'atlas', 'sand', 100)).toContainEqual({
      ...line,
      variantId: 'sand',
      quantity: 7,
    })
  })
  it('includes variant surcharges and applies the shipping threshold', () => {
    expect(totals([{ productId: 'chalk', variantId: 'oat', quantity: 2 }])).toEqual({
      subtotal: 108,
      shipping: 9,
      total: 117,
    })
    expect(totals([line])).toEqual({ subtotal: 189, shipping: 0, total: 189 })
    expect(
      totals([
        { productId: 'coil', variantId: 'sand', quantity: 1 },
        { productId: 'chalk', variantId: 'chalk', quantity: 2 },
        { productId: 'tools', variantId: 'standard', quantity: 1 },
      ]),
    ).toEqual({ subtotal: 151, shipping: 0, total: 151 })
    expect(totals([])).toEqual({ subtotal: 0, shipping: 0, total: 0 })
  })
  it('refuses empty orders and snapshots prices and variants', () => {
    expect(() => createDemoOrder([], 'DEMO-EMPTY')).toThrow('empty')
    const order = createDemoOrder(
      [{ ...line, variantId: 'sand', quantity: 2 }],
      'DEMO-TEST',
    )
    expect(order).toEqual({
      id: 'DEMO-TEST',
      lines: [{ name: 'Atlas 75', variant: 'Sand', quantity: 2, unitPrice: 194 }],
      subtotal: 388,
      shipping: 0,
      total: 388,
    })
  })
})

describe('checkout validation', () => {
  it('accepts valid fictional details', () => expect(validateCheckout(valid)).toEqual({}))
  it('rejects blank or whitespace required fields, invalid email and missing consent', () => {
    expect(
      validateCheckout({
        ...valid,
        firstName: ' ',
        lastName: '',
        email: 'demo@',
        address: ' ',
        city: ' ',
        postal: '',
        demoConsent: false,
      }),
    ).toMatchObject({
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      address: expect.any(String),
      city: expect.any(String),
      postal: expect.any(String),
      demoConsent: expect.any(String),
    })
  })
  it.each([
    ['Germany', '10115', ''],
    ['Italy', '00100', ''],
    ['France', '75001', ''],
    ['United Kingdom', 'SW1A 1AA', ''],
    ['United States', '10001', 'NY'],
    ['United States', '10001-1234', 'NY'],
    ['Canada', 'K1A 0B1', 'ON'],
  ])('accepts %s postal format %s', (country, postal, region) =>
    expect(validateCheckout({ ...valid, country, postal, region })).toEqual({}),
  )
  it('requires a state/province only where needed and rejects unsupported destinations', () => {
    expect(
      validateCheckout({ ...valid, country: 'United States', postal: '10001' }),
    ).toHaveProperty('region')
    expect(
      validateCheckout({ ...valid, country: 'Canada', postal: 'K1A 0B1' }),
    ).toHaveProperty('region')
    expect(validateCheckout({ ...valid, country: 'Unknown' })).toHaveProperty('country')
  })
})
