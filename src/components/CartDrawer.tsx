import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/store-api'
import '../styles/CartDrawer.css'

const CartDrawer = () => {
  const { items, itemCount, cart, drawerOpen, closeDrawer, updateQuantity, removeItem, loading } = useCart()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState<Record<string, 'removing' | null>>({})

  const hasCoupon = (cart?.coupons?.length ?? 0) > 0
  const couponCode = hasCoupon ? cart?.coupons?.[0]?.code?.toUpperCase() : null
  const discountMinor = Number.parseInt(cart?.totals?.total_discount ?? '0', 10)
  const hasDiscount = discountMinor > 0
  const subtotalMinor = Number.parseInt(cart?.totals?.total_items ?? '0', 10)
  const estimatedTotalMinor = Math.max(subtotalMinor - discountMinor, 0)
  const discountLabel = cart && cart.totals
    ? formatPrice(String(discountMinor), cart.totals.currency_minor_unit, cart.totals.currency_code)
    : '$0.00'
  const estimatedTotalLabel = cart && cart.totals
    ? formatPrice(String(estimatedTotalMinor), cart.totals.currency_minor_unit, cart.totals.currency_code)
    : '$0.00'

  const setProcessingState = (key: string, state: 'removing' | null) => {
    setProcessing((prev) => ({ ...prev, [key]: state }))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${drawerOpen ? 'cart-backdrop--open' : ''}`}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <aside className={`cart-drawer ${drawerOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Your Cart ({itemCount})</h3>
          <button className="cart-drawer-close" onClick={closeDrawer} aria-label="Close cart">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <p>Your cart is empty</p>
            <button className="cart-drawer-shop-btn" onClick={closeDrawer}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => {
                const price = formatPrice(
                  item.prices.price,
                  item.prices.currency_minor_unit,
                  item.prices.currency_code,
                )
                const lineTotal = formatPrice(
                  item.totals.line_total,
                  item.totals.currency_minor_unit,
                  item.totals.currency_code,
                )

                const isRemoving = processing[item.key] === 'removing'

                return (
                  <div key={item.key} className={`cart-item ${isRemoving ? 'cart-item--removing' : ''}`}>
                    <div className="cart-item-image">
                      <img
                        src={item.images[0]?.thumbnail ?? item.images[0]?.src ?? '/perfumes/placeholder.png'}
                        alt={item.images[0]?.alt ?? item.name}
                      />
                    </div>
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-price">{price}</span>

                      <div className="cart-item-qty">
                        <button
                          className="cart-qty-btn"
                          onClick={() => {
                            const newQty = Math.max(1, item.quantity - 1)
                            void updateQuantity(item.key, newQty)
                          }}
                          disabled={loading || item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => {
                            const newQty = item.quantity + 1
                            void updateQuantity(item.key, newQty)
                          }}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-line-total">{lineTotal}</span>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={async () => {
                        setProcessingState(item.key, 'removing')
                        try {
                          await removeItem(item.key)
                        } finally {
                          setProcessingState(item.key, null)
                        }
                      }}
                      disabled={loading || isRemoving}
                      aria-label={`Remove ${item.name}`}
                    >
                      {isRemoving ? <span className="spinner" aria-hidden /> : '✕'}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="cart-drawer-footer">
              {hasDiscount && (
                <div className="cart-drawer-discount">
                  <span>{couponCode ? `Coupon (${couponCode})` : 'Coupon Discount'}</span>
                  <span>-{discountLabel}</span>
                </div>
              )}

              <div className="cart-drawer-total">
                <span>Total</span>
                <span>{estimatedTotalLabel}</span>
              </div>

              <p className="cart-drawer-delivery-note">
                Delivery charges are based on your location and will be calculated at checkout.
              </p>

              <button
                className="cart-checkout-btn"
                onClick={() => {
                  closeDrawer()
                  navigate('/checkout-review')
                }}
              >
                Proceed to Checkout
              </button>
              <button className="cart-continue-btn" onClick={closeDrawer}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
