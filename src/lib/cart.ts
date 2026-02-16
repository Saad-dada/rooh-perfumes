/**
 * WooCommerce Cart Helpers
 *
 * Since we're using a headless approach, we redirect users to
 * the WooCommerce store for cart / checkout (WooCommerce handles
 * payments, taxes, shipping securely).
 */

const WC_BASE = import.meta.env.VITE_WC_BASE_URL?.replace(/\/+$/, '') ?? ''

/**
 * Redirect to WooCommerce to add a product to cart and go to checkout.
 * Uses the ?add-to-cart=ID query param that WooCommerce supports natively.
 */
export function addToCartAndCheckout(productId: number) {
  const url = `${WC_BASE}/checkout/?add-to-cart=${productId}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Redirect to WooCommerce to add a product to cart (stays on cart page).
 */
export function addToCart(productId: number) {
  const url = `${WC_BASE}/?add-to-cart=${productId}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Open the WooCommerce cart page.
 */
export function openCart() {
  window.open(`${WC_BASE}/cart/`, '_blank', 'noopener,noreferrer')
}

/**
 * Open the WooCommerce checkout page.
 */
export function openCheckout() {
  window.open(`${WC_BASE}/checkout/`, '_blank', 'noopener,noreferrer')
}
