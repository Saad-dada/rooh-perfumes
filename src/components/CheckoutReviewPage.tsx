import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CART_SYNC_KEY, useCart } from '../context/CartContext'
import { formatPrice } from '../lib/store-api'
import { useWooProducts } from '../hooks/useWooProducts'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/CheckoutReviewPage.css'

const CheckoutReviewPage = () => {
  const { items, cart, loading, addToCart, syncCheckout, refreshCart } = useCart()
  const { products, loading: productsLoading } = useWooProducts({ per_page: 8 })

  useEffect(() => {
    void refreshCart()

    const handleFocus = () => {
      void refreshCart()
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void refreshCart()
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_SYNC_KEY) {
        void refreshCart()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('storage', handleStorage)
    }
  }, [refreshCart])

  const currencyCode = cart?.totals?.currency_code ?? 'AED'
  const currencyMinorUnit = cart?.totals?.currency_minor_unit ?? 2
  const subtotalMinor = cart?.totals?.total_items ?? '0'
  const totalMinor = cart?.totals?.total_price ?? '0'
  const hasCoupon = (cart?.coupons?.length ?? 0) > 0
  const couponCode = hasCoupon ? cart?.coupons?.[0]?.code?.toUpperCase() : null

  const discountFromTotals = Number.parseInt(cart?.totals?.total_discount ?? '0', 10)
  const discountFallback = Math.max(
    Number.parseInt(subtotalMinor, 10) - Number.parseInt(totalMinor, 10),
    0,
  )
  const discountMinor = discountFromTotals > 0 ? discountFromTotals : discountFallback
  const hasDiscount = discountMinor > 0
  const estimatedTotalMinor = hasDiscount
    ? String(Math.max(Number.parseInt(subtotalMinor, 10) - discountMinor, 0))
    : subtotalMinor

  const subtotalLabel = formatPrice(subtotalMinor, currencyMinorUnit, currencyCode)
  const discountLabel = formatPrice(String(discountMinor), currencyMinorUnit, currencyCode)
  const estimatedTotalLabel = formatPrice(estimatedTotalMinor, currencyMinorUnit, currencyCode)

  const quickAddProducts = useMemo(() => {
    const inStockProducts = products.filter((product) => product.stock_status === 'instock')
    const shuffled = [...inStockProducts].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4)
  }, [products])

  if (items.length === 0) {
    return (
      <div className="checkout-review-page">
        <Navbar />
        <main className="checkout-review-main">
          <div className="checkout-review-empty">
            <h1>Your cart is empty</h1>
            <p>Add products before continuing to checkout.</p>
            <Link to="/shop" className="checkout-review-back-link">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="checkout-review-page">
      <Navbar />

      <main className="checkout-review-main">
        <Link to="/shop" className="checkout-review-back-link">
          ← Continue Shopping
        </Link>

        <h1 className="checkout-review-title">Review Before Checkout</h1>

        <div className="checkout-review-layout">
          <section className="checkout-review-summary">
            <h2>Order Summary</h2>
            <div className="checkout-review-items">
              {items.map((item) => {
                const lineTotal = formatPrice(
                  item.totals.line_total,
                  item.totals.currency_minor_unit,
                  item.totals.currency_code,
                )

                return (
                  <article key={item.key} className="checkout-review-item">
                    <img
                      src={item.images[0]?.thumbnail ?? item.images[0]?.src ?? '/perfumes/placeholder.png'}
                      alt={item.name}
                    />
                    <div className="checkout-review-item-content">
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span className="checkout-review-item-price">{lineTotal}</span>
                  </article>
                )
              })}
            </div>

            <div className="checkout-review-total-row">
              <span>Subtotal</span>
              <span className={hasDiscount ? 'checkout-review-subtotal-strike' : ''}>{subtotalLabel}</span>
            </div>

            {hasDiscount && (
              <div className="checkout-review-total-row checkout-review-discount-row">
                <span>{couponCode ? `Coupon (${couponCode})` : 'Coupon Discount'}</span>
                <strong>-{discountLabel}</strong>
              </div>
            )}

            <div className="checkout-review-total-row checkout-review-grand-total-row">
              <span>Estimated Total</span>
              <strong>{estimatedTotalLabel}</strong>
            </div>

            <p className="checkout-review-delivery-note">
              Delivery charges are based on your location and will be calculated at checkout.
            </p>

            {!hasDiscount && (
              <p className="checkout-review-coupon-note">
                Auto coupon will be applied on WooCommerce checkout.
              </p>
            )}

            <button
              type="button"
              className="checkout-review-continue-btn"
              onClick={syncCheckout}
            >
              Continue to Secure Checkout
            </button>
          </section>

          <aside className="checkout-review-quick-add">
            <h2>Quick Add</h2>
            <p>Add one more item before checkout.</p>

            {productsLoading ? (
              <p className="checkout-review-muted">Loading suggestions…</p>
            ) : quickAddProducts.length === 0 ? (
              <p className="checkout-review-muted">No quick add products available right now.</p>
            ) : (
              <div className="checkout-review-quick-add-list">
                {quickAddProducts.map((product) => (
                  <article key={product.id} className="checkout-review-quick-add-item">
                    <img
                      src={product.images[0]?.src ?? '/perfumes/placeholder.png'}
                      alt={product.images[0]?.alt ?? product.name}
                    />
                    <div className="checkout-review-quick-add-content">
                      <h3>{product.name}</h3>
                      <span>AED {product.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void addToCart(product.id, 1)}
                      disabled={loading}
                    >
                      Add
                    </button>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CheckoutReviewPage
