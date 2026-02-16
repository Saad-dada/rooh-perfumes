import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/store-api'
import '../styles/CartDrawer.css'

const CartDrawer = () => {
  const { items, itemCount, total, drawerOpen, closeDrawer, updateQuantity, removeItem, loading, syncCheckout } = useCart()

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

                return (
                  <div key={item.key} className="cart-item">
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
                          onClick={() => updateQuantity(item.key, Math.max(1, item.quantity - 1))}
                          disabled={loading || item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-line-total">{lineTotal}</span>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.key)}
                      disabled={loading}
                      aria-label={`Remove ${item.name}`}
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-total">
                <span>Total</span>
                <span>{total}</span>
              </div>
              <button
                className="cart-checkout-btn"
                onClick={() => {
                  closeDrawer()
                  syncCheckout()
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
