import { usePreferences } from '../context/preferences-context'
import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { createDemoOrder } from '../lib/cart'
import {
  countries,
  validateCheckout,
  type CheckoutFields,
  type CheckoutErrors,
} from '../lib/checkout'

import { RECEIPT_KEY, validateReceipt } from '../lib/receipt'
import type { DemoOrder } from '../types/product'
import { OrderSummary } from './Cart'

export default function Checkout() {
  const { t } = usePreferences()

  const { lines, clear } = useCart()
  const navigate = useNavigate()
  const submitted = useRef(false)
  const [fields, setFields] = useState<CheckoutFields>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    region: '',
    postal: '',
    country: 'Germany',
    demoConsent: false,
  })
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [failed, setFailed] = useState('')
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitted.current) return
    const next = validateCheckout(fields)
    setErrors(next)
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus())
      return
    }
    submitted.current = true
    try {
      const receipt = createDemoOrder(
        lines,
        `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      )
      try {
        sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt))
      } catch {
        /* Receipt is also passed in memory. */
      }
      clear()
      navigate('/order-confirmation', { replace: true, state: receipt })
    } catch {
      setFailed('Your bag is empty. Add an item before checking out.')
      submitted.current = false
    }
  }
  function field(
    key: Exclude<keyof CheckoutFields, 'demoConsent' | 'country'>,
    label: string,
    autoComplete: string,
    required = true,
  ) {
    return (
      <div
        className={`form-field ${key === 'address' || key === 'email' ? 'full-width' : ''}`}
      >
        <label htmlFor={key}>
          {t(label)}
          {!required && <span className="optional"> {t('(optional)')}</span>}
        </label>
        <input
          id={key}
          name={key}
          value={fields[key]}
          type={key === 'email' ? 'email' : 'text'}
          autoComplete={autoComplete}
          maxLength={key === 'email' ? 254 : 120}
          required={required}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          onChange={(e) => {
            setFields((old) => ({ ...old, [key]: e.target.value }))
            setErrors((old) => ({ ...old, [key]: undefined }))
          }}
        />
        {errors[key] && (
          <span className="form-error" id={`${key}-error`}>
            {t(errors[key]!)}
          </span>
        )}
      </div>
    )
  }
  if (!lines.length)
    return (
      <section className="section empty-state">
        <h1>{t('Your bag is empty.')}</h1>
        <p>{t('Add something to your bag before trying the demo checkout.')}</p>
        <Link className="button primary" to="/products">
          {t('Explore the collection →')}
        </Link>
      </section>
    )
  return (
    <section className="section checkout-page">
      <Link className="text-link" to="/cart">
        {t('← Back to your bag')}
      </Link>
      <p className="eyebrow">{t('ONE MORE THING')}</p>
      <h1>{t('Make it yours.')}</h1>
      <div className="demo-banner">
        <strong>{t('This is a demo checkout.')}</strong>{' '}
        {t(
          'Use fictional details. Nothing is sent to a server, no payment is taken, and no real order is placed. Contact and address details are discarded when you leave this page.',
        )}
      </div>
      <div className="commerce-layout">
        <form noValidate onSubmit={submit} className="checkout-form">
          <h2>{t('01 / Your details')}</h2>
          <div className="form-grid">
            {field('firstName', 'First name', 'given-name')}
            {field('lastName', 'Last name', 'family-name')}
            {field('email', 'Email address', 'email')}
          </div>
          <h2>{t('02 / Shipping address')}</h2>
          <div className="form-grid">
            {field('address', 'Street address', 'address-line1')}
            {field('apartment', 'Apartment / suite', 'address-line2', false)}
            {field('city', 'City', 'address-level2')}
            {field(
              'region',
              'State / province / region',
              'address-level1',
              ['United States', 'Canada'].includes(fields.country),
            )}
            {field('postal', 'Postal code', 'postal-code')}
            <label htmlFor="country">
              {t('Country')}
              <select
                id="country"
                name="country"
                value={fields.country}
                aria-invalid={!!errors.country}
                onChange={(e) => {
                  setFields((old) => ({ ...old, country: e.target.value }))
                  setErrors((old) => ({
                    ...old,
                    country: undefined,
                    postal: undefined,
                    region: undefined,
                  }))
                }}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {t(c)}
                  </option>
                ))}
              </select>
              {errors.country && <span className="form-error">{t(errors.country)}</span>}
            </label>
          </div>
          <h2>{t('03 / Demo payment')}</h2>
          <div className="demo-payment">
            <Check size={18} />
            <div>
              <strong>{t('No payment required')}</strong>
              <p>
                {t(
                  'This simulated order costs nothing. Please do not enter card information.',
                )}
              </p>
            </div>
          </div>
          <label className="consent" htmlFor="demoConsent">
            <input
              id="demoConsent"
              type="checkbox"
              checked={fields.demoConsent}
              aria-invalid={!!errors.demoConsent}
              aria-describedby={errors.demoConsent ? 'demoConsent-error' : undefined}
              onChange={(e) => {
                setFields((old) => ({ ...old, demoConsent: e.target.checked }))
                setErrors((old) => ({ ...old, demoConsent: undefined }))
              }}
            />
            {t(
              'I understand this is a portfolio demonstration and no real order will be placed.',
            )}
          </label>
          {errors.demoConsent && (
            <p id="demoConsent-error" className="form-error">
              {t(errors.demoConsent)}
            </p>
          )}
          {Object.values(errors).some(Boolean) && (
            <p className="form-error" role="alert">
              {t('Please check the highlighted fields before continuing.')}
            </p>
          )}
          {failed && (
            <p className="form-error" role="alert">
              {t(failed)}
            </p>
          )}
          <button className="button primary" type="submit">
            {t('Place demo order')} <ArrowRight size={18} />
          </button>
        </form>
        <OrderSummary checkout />
      </div>
    </section>
  )
}

function readReceipt(): DemoOrder | null {
  try {
    return validateReceipt(JSON.parse(sessionStorage.getItem(RECEIPT_KEY) || 'null'))
  } catch {
    return null
  }
}

export function OrderConfirmation() {
  const { t, money } = usePreferences()

  const [receipt] = useState(readReceipt)
  const { state } = useLocation()
  // The current navigation takes priority if saving a newer receipt failed.
  const order = validateReceipt(state) || receipt
  if (!order)
    return (
      <section className="section empty-state">
        <h1>{t('No demo order yet.')}</h1>
        <p>{t('Your next setup is waiting in the collection.')}</p>
        <Link className="button primary" to="/products">
          {t('Explore the collection →')}
        </Link>
      </section>
    )
  return (
    <section className="section confirmation">
      <div className="confirmation-icon">
        <Check size={30} />
      </div>
      <p className="eyebrow">{t('SIMULATION COMPLETE')}</p>
      <h1>
        {t('A good choice.')}
        <br />
        {t('A better everyday.')}
      </h1>
      <p className="confirmation-lead">{t('Your demo order is complete.')}</p>
      <div className="demo-banner">
        {t(
          'No real order was placed, nothing will be shipped, and no payment was taken. No confirmation email is sent.',
        )}
      </div>
      <div className="receipt">
        <div className="section-heading">
          <h2>{t('Your demo receipt')}</h2>
          <span>{order.id}</span>
        </div>
        {order.lines.map((l, i) => (
          <div className="summary-line" key={i}>
            <span>
              {l.quantity} × {l.name}
              <small>{t(l.variant)}</small>
            </span>
            <span>{money(l.quantity * l.unitPrice)}</span>
          </div>
        ))}
        <div className="summary-line">
          <span>{t('Subtotal')}</span>
          <span>{money(order.subtotal)}</span>
        </div>
        <div className="summary-line">
          <span>{t('Demo shipping')}</span>
          <span>{order.shipping ? money(order.shipping) : t('Free')}</span>
        </div>
        <div className="summary-line summary-total">
          <strong>{t('Demo total')}</strong>
          <strong>{money(order.total)}</strong>
        </div>
      </div>
      <Link className="button primary" to="/products">
        {t('Keep exploring')} <ArrowRight size={18} />
      </Link>
    </section>
  )
}
