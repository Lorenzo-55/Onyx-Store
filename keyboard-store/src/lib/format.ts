export const BRAND = 'ØNYX'

// Keep currency formatting consistent wherever storefront prices are displayed.
export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
