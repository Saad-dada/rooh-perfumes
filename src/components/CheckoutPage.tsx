import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, getPaymentMethods, checkout, clearCartToken, type PaymentMethod } from '../lib/store-api'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/CheckoutPage.css'

const isWooConfigured =
  import.meta.env.VITE_WC_BASE_URL &&
  !import.meta.env.VITE_WC_BASE_URL.includes('your-wordpress-site')

const CheckoutPage = () => {
  const { items, total, cart, refreshCart } = useCart()
  const navigate = useNavigate()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPayment, setSelectedPayment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  // Form fields
  const [form, setForm] = useState({
    email: '',
    phone: '',
    ship_first_name: '',
    ship_last_name: '',
    ship_address_1: '',
    ship_address_2: '',
    ship_city: '',
    ship_state: '',
    ship_postcode: '',
    ship_country: 'US',
    bill_first_name: '',
    bill_last_name: '',
    bill_address_1: '',
    bill_address_2: '',
    bill_city: '',
    bill_state: '',
    bill_postcode: '',
    bill_country: 'US',
  })

  // Load payment methods
  useEffect(() => {
    if (!isWooConfigured) return
    getPaymentMethods()
      .then((methods) => {
        setPaymentMethods(methods)
        if (methods.length > 0) setSelectedPayment(methods[0].id)
      })
      .catch((err) => console.error('Failed to load payment methods:', err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isWooConfigured || items.length === 0) return

    setSubmitting(true)
    setError(null)

    const billingAddress = sameAsShipping
      ? {
          first_name: form.ship_first_name,
          last_name: form.ship_last_name,
          address_1: form.ship_address_1,
          address_2: form.ship_address_2,
          city: form.ship_city,
          state: form.ship_state,
          postcode: form.ship_postcode,
          country: form.ship_country,
          email: form.email,
          phone: form.phone,
        }
      : {
          first_name: form.bill_first_name,
          last_name: form.bill_last_name,
          address_1: form.bill_address_1,
          address_2: form.bill_address_2,
          city: form.bill_city,
          state: form.bill_state,
          postcode: form.bill_postcode,
          country: form.bill_country,
          email: form.email,
          phone: form.phone,
        }

    try {
      const result = await checkout({
        billing_address: billingAddress,
        shipping_address: {
          first_name: form.ship_first_name,
          last_name: form.ship_last_name,
          address_1: form.ship_address_1,
          address_2: form.ship_address_2,
          city: form.ship_city,
          state: form.ship_state,
          postcode: form.ship_postcode,
          country: form.ship_country,
        },
        payment_method: selectedPayment,
      })

      // If payment requires redirect (e.g. PayPal)
      if (result.payment_result?.redirect_url) {
        window.location.href = result.payment_result.redirect_url
        return
      }

      // Clear token so next cart session is fresh
      clearCartToken()
      await refreshCart()

      // Navigate to confirmation
      navigate(`/order-confirmation/${result.order_id}`, {
        state: { orderResult: result },
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed. Please try again.'
      setError(msg)
      console.error('Checkout error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isWooConfigured) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-main">
          <div className="checkout-empty">
            <h2>Checkout unavailable</h2>
            <p>WooCommerce is not configured yet.</p>
            <Link to="/" className="checkout-back-link">← Back to shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-main">
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <Link to="/" className="checkout-back-link">← Back to shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-main">
        <Link to="/" className="checkout-back-link">← Back to shop</Link>
        <h1 className="checkout-title">Checkout</h1>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          {/* Left: form fields */}
          <div className="checkout-form">
            {/* Contact */}
            <section className="checkout-section">
              <h3 className="checkout-section-title">Contact</h3>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="checkout-field">
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="checkout-section">
              <h3 className="checkout-section-title">Shipping Address</h3>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label htmlFor="ship_first_name">First Name</label>
                  <input type="text" id="ship_first_name" name="ship_first_name" value={form.ship_first_name} onChange={handleChange} required />
                </div>
                <div className="checkout-field">
                  <label htmlFor="ship_last_name">Last Name</label>
                  <input type="text" id="ship_last_name" name="ship_last_name" value={form.ship_last_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="checkout-field">
                <label htmlFor="ship_address_1">Address</label>
                <input type="text" id="ship_address_1" name="ship_address_1" value={form.ship_address_1} onChange={handleChange} required />
              </div>
              <div className="checkout-field">
                <label htmlFor="ship_address_2">Apartment, suite, etc. (optional)</label>
                <input type="text" id="ship_address_2" name="ship_address_2" value={form.ship_address_2} onChange={handleChange} />
              </div>
              <div className="checkout-row checkout-row-3">
                <div className="checkout-field">
                  <label htmlFor="ship_city">City</label>
                  <input type="text" id="ship_city" name="ship_city" value={form.ship_city} onChange={handleChange} required />
                </div>
                <div className="checkout-field">
                  <label htmlFor="ship_state">State</label>
                  <input type="text" id="ship_state" name="ship_state" value={form.ship_state} onChange={handleChange} required />
                </div>
                <div className="checkout-field">
                  <label htmlFor="ship_postcode">ZIP Code</label>
                  <input type="text" id="ship_postcode" name="ship_postcode" value={form.ship_postcode} onChange={handleChange} required />
                </div>
              </div>
              <div className="checkout-field">
                <label htmlFor="ship_country">Country</label>
                <select id="ship_country" name="ship_country" value={form.ship_country} onChange={handleChange}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="PK">Pakistan</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </section>

            {/* Billing toggle */}
            <section className="checkout-section">
              <label className="checkout-checkbox">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                />
                <span>Billing address same as shipping</span>
              </label>

              {!sameAsShipping && (
                <>
                  <h3 className="checkout-section-title" style={{ marginTop: 20 }}>Billing Address</h3>
                  <div className="checkout-row">
                    <div className="checkout-field">
                      <label htmlFor="bill_first_name">First Name</label>
                      <input type="text" id="bill_first_name" name="bill_first_name" value={form.bill_first_name} onChange={handleChange} required />
                    </div>
                    <div className="checkout-field">
                      <label htmlFor="bill_last_name">Last Name</label>
                      <input type="text" id="bill_last_name" name="bill_last_name" value={form.bill_last_name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="bill_address_1">Address</label>
                    <input type="text" id="bill_address_1" name="bill_address_1" value={form.bill_address_1} onChange={handleChange} required />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="bill_address_2">Apartment, suite, etc. (optional)</label>
                    <input type="text" id="bill_address_2" name="bill_address_2" value={form.bill_address_2} onChange={handleChange} />
                  </div>
                  <div className="checkout-row checkout-row-3">
                    <div className="checkout-field">
                      <label htmlFor="bill_city">City</label>
                      <input type="text" id="bill_city" name="bill_city" value={form.bill_city} onChange={handleChange} required />
                    </div>
                    <div className="checkout-field">
                      <label htmlFor="bill_state">State</label>
                      <input type="text" id="bill_state" name="bill_state" value={form.bill_state} onChange={handleChange} required />
                    </div>
                    <div className="checkout-field">
                      <label htmlFor="bill_postcode">ZIP Code</label>
                      <input type="text" id="bill_postcode" name="bill_postcode" value={form.bill_postcode} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="bill_country">Country</label>
                    <select id="bill_country" name="bill_country" value={form.bill_country} onChange={handleChange}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="PK">Pakistan</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </>
              )}
            </section>

            {/* Payment */}
            <section className="checkout-section">
              <h3 className="checkout-section-title">Payment</h3>
              {paymentMethods.length === 0 && (
                <p className="checkout-note">Loading payment methods…</p>
              )}
              <div className="checkout-payment-methods">
                {paymentMethods.map((pm) => (
                  <label key={pm.id} className="checkout-payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value={pm.id}
                      checked={selectedPayment === pm.id}
                      onChange={() => setSelectedPayment(pm.id)}
                    />
                    <div>
                      <strong>{pm.title}</strong>
                      {pm.description && (
                        <span
                          className="checkout-payment-desc"
                          dangerouslySetInnerHTML={{ __html: pm.description }}
                        />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {error && <div className="checkout-error">{error}</div>}

            <button
              type="submit"
              className="checkout-submit-btn"
              disabled={submitting || items.length === 0}
            >
              {submitting ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>

          {/* Right: order summary */}
          <aside className="checkout-summary">
            <h3 className="checkout-summary-title">Order Summary</h3>

            <div className="checkout-summary-items">
              {items.map((item) => {
                const lineTotal = formatPrice(
                  item.totals.line_total,
                  item.totals.currency_minor_unit,
                  item.totals.currency_code,
                )
                return (
                  <div key={item.key} className="checkout-summary-item">
                    <div className="checkout-summary-item-img">
                      <img
                        src={item.images[0]?.thumbnail ?? item.images[0]?.src ?? '/perfumes/placeholder.png'}
                        alt={item.name}
                      />
                      <span className="checkout-summary-qty">{item.quantity}</span>
                    </div>
                    <div className="checkout-summary-item-info">
                      <span className="checkout-summary-item-name">{item.name}</span>
                      <span className="checkout-summary-item-price">{lineTotal}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="checkout-summary-totals">
              {cart && (
                <>
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.totals.total_items, cart.totals.currency_minor_unit, cart.totals.currency_code)}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Shipping</span>
                    <span>
                      {parseInt(cart.totals.total_shipping) === 0
                        ? 'Free'
                        : formatPrice(cart.totals.total_shipping, cart.totals.currency_minor_unit, cart.totals.currency_code)}
                    </span>
                  </div>
                  {parseInt(cart.totals.total_tax) > 0 && (
                    <div className="checkout-summary-row">
                      <span>Tax</span>
                      <span>{formatPrice(cart.totals.total_tax, cart.totals.currency_minor_unit, cart.totals.currency_code)}</span>
                    </div>
                  )}
                </>
              )}
              <div className="checkout-summary-row checkout-summary-total">
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CheckoutPage
