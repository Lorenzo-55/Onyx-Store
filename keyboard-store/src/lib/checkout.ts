export const countries = [
  'Germany',
  'Italy',
  'France',
  'United Kingdom',
  'United States',
  'Canada',
] as const

export interface CheckoutFields {
  firstName: string
  lastName: string
  email: string
  address: string
  apartment: string
  city: string
  region: string
  postal: string
  country: string
  demoConsent: boolean
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>

export function validateCheckout(f: CheckoutFields): CheckoutErrors {
  const errors: CheckoutErrors = {}
  for (const key of ['firstName', 'lastName', 'address', 'city'] as const) {
    if (f[key].trim().length < 2) errors[key] = 'Enter at least 2 characters.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    errors.email = 'Enter a valid email address.'
  if (!countries.includes(f.country as (typeof countries)[number]))
    errors.country = 'Choose a demo shipping country.'
  // Postal formats follow the selected shipping country; validate trimmed input below.
  const patterns: Record<string, RegExp> = {
    Germany: /^\d{5}$/,
    Italy: /^\d{5}$/,
    France: /^\d{5}$/,
    'United States': /^\d{5}(-\d{4})?$/,
    Canada: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
    'United Kingdom': /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  }
  if (!(patterns[f.country] || /^.{3,12}$/).test(f.postal.trim()))
    errors.postal = 'Enter a valid postal code for this country.'
  if (['United States', 'Canada'].includes(f.country) && f.region.trim().length < 2)
    errors.region = 'Enter a state or province.'
  if (!f.demoConsent)
    errors.demoConsent = 'Confirm that you understand this is a demonstration.'
  return errors
}
