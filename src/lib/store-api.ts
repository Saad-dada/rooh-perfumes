import axios from 'axios'

/**
 * WooCommerce Store API client (v1) – Headless mode
 *
 * The Store API needs a nonce for POST requests. We fetch a nonce by loading
 * the WP homepage and extracting it, or via a lightweight nonce endpoint.
 * Cart sessions are tracked via the `Cart-Token` header.
 */

const WC_BASE = import.meta.env.VITE_WC_BASE_URL?.replace(/\/+$/, '') ?? ''

// In dev mode, use relative path so Vite proxy handles CORS
const isDev = import.meta.env.DEV
const storeBaseURL = isDev ? '/wp-json/wc/store/v1' : `${WC_BASE}/wp-json/wc/store/v1`

const CART_TOKEN_KEY = 'rooh_cart_token'
const NONCE_CACHE_KEY = 'rooh_wc_nonce'
const NONCE_TTL = 10 * 60 * 1000 // 10 minutes

/**
 * Cart-Token and Nonce are paired.
 * WooCommerce returns a JWT Cart-Token and a Nonce in response headers.
 * We must save and reuse both — the nonce is only valid for the JWT session.
 */

function getCartToken(): string | null {
  return localStorage.getItem(CART_TOKEN_KEY)
}

function saveCartToken(token: string) {
  localStorage.setItem(CART_TOKEN_KEY, token)
}

export function clearCartToken() {
  localStorage.removeItem(CART_TOKEN_KEY)
  localStorage.removeItem(NONCE_CACHE_KEY)
}

// ── Nonce management ──

interface CachedNonce {
  value: string
  timestamp: number
}

function getCachedNonce(): string | null {
  try {
    const cached = localStorage.getItem(NONCE_CACHE_KEY)
    if (cached) {
      const parsed: CachedNonce = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < NONCE_TTL) {
        return parsed.value
      }
    }
  } catch { /* ignore */ }
  return null
}

function saveNonce(nonce: string) {
  localStorage.setItem(NONCE_CACHE_KEY, JSON.stringify({ value: nonce, timestamp: Date.now() }))
}

/** Capture Cart-Token + Nonce from any Store API response headers */
function captureSessionHeaders(headers: Record<string, string>) {
  const token = headers['cart-token']
  if (token) saveCartToken(token)

  const nonce = headers['nonce']
  if (nonce) saveNonce(nonce)
}

/**
 * Initialise the session by doing a GET /cart.
 * This gives us a valid JWT Cart-Token and a Nonce for POST requests.
 */
let initPromise: Promise<void> | null = null

async function ensureSession(): Promise<{ cartToken: string; nonce: string }> {
  const token = getCartToken()
  const nonce = getCachedNonce()

  // Already have both — use them
  if (token && nonce) return { cartToken: token, nonce }

  // Need to fetch — de-duplicate concurrent calls
  if (!initPromise) {
    initPromise = (async () => {
      const url = isDev
        ? '/wp-json/wc/store/v1/cart'
        : `${WC_BASE}/wp-json/wc/store/v1/cart`

      const existingToken = getCartToken()
      const headers: Record<string, string> = {}
      if (existingToken) headers['Cart-Token'] = existingToken

      const resp = await axios.get(url, { headers })
      captureSessionHeaders(resp.headers as Record<string, string>)
    })().finally(() => { initPromise = null })
  }

  await initPromise
  return {
    cartToken: getCartToken() ?? '',
    nonce: getCachedNonce() ?? '',
  }
}

const storeApi = axios.create({
  baseURL: storeBaseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Cart-Token and Nonce to every request
storeApi.interceptors.request.use(async (config) => {
  const { cartToken, nonce } = await ensureSession()

  if (cartToken) config.headers['Cart-Token'] = cartToken

  // POST/PUT/DELETE requests need a nonce
  if (config.method && config.method !== 'get') {
    if (nonce) config.headers['Nonce'] = nonce
  }

  return config
})

// Capture fresh headers from every response; retry on nonce failure
storeApi.interceptors.response.use(
  (response) => {
    captureSessionHeaders(response.headers as Record<string, string>)
    return response
  },
  async (error) => {
    const original = error.config
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'woocommerce_rest_missing_nonce' &&
      !original._retried
    ) {
      original._retried = true
      // Clear cached values and re-init from scratch
      localStorage.removeItem(NONCE_CACHE_KEY)
      localStorage.removeItem(CART_TOKEN_KEY)
      const { cartToken, nonce } = await ensureSession()
      original.headers['Cart-Token'] = cartToken
      original.headers['Nonce'] = nonce
      return storeApi(original)
    }
    return Promise.reject(error)
  },
)

// ── Types ──

export interface StoreCartItem {
  key: string
  id: number
  name: string
  quantity: number
  prices: {
    price: string       // in minor units e.g. "11100" for $111.00
    regular_price: string
    sale_price: string
    currency_code: string
    currency_minor_unit: number
  }
  images: { id: number; src: string; alt: string; thumbnail: string }[]
  short_description: string
  totals: {
    line_subtotal: string
    line_total: string
    currency_code: string
    currency_minor_unit: number
  }
}

export interface StoreCart {
  items: StoreCartItem[]
  items_count: number
  totals: {
    total_items: string
    total_price: string
    total_shipping: string
    total_tax: string
    currency_code: string
    currency_minor_unit: number
  }
  shipping_rates: ShippingRate[]
  needs_shipping: boolean
}

export interface ShippingRate {
  package_id: number
  name: string
  destination: Record<string, string>
  items: { key: string; name: string; quantity: number }[]
  shipping_rates: {
    rate_id: string
    name: string
    price: string
    currency_code: string
    currency_minor_unit: number
    selected: boolean
  }[]
}

export interface PaymentMethod {
  id: string
  title: string
  description: string
}

export interface OrderResult {
  order_id: number
  status: string
  order_key: string
  payment_result: {
    payment_status: string
    redirect_url?: string
  }
}

// ── Helper: format price from minor units ──

export function formatPrice(minorUnits: string, currencyMinorUnit: number, currencyCode = 'USD'): string {
  const amount = parseInt(minorUnits, 10) / Math.pow(10, currencyMinorUnit)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

// ── API Functions ──

/** Get the current cart */
export async function getCart(): Promise<StoreCart> {
  const { data } = await storeApi.get<StoreCart>('/cart')
  return data
}

/** Add an item to the cart */
export async function addItemToCart(productId: number, quantity = 1): Promise<StoreCart> {
  const { data } = await storeApi.post<StoreCart>('/cart/add-item', {
    id: productId,
    quantity,
  })
  return data
}

/** Update item quantity */
export async function updateItemQuantity(itemKey: string, quantity: number): Promise<StoreCart> {
  const { data } = await storeApi.post<StoreCart>('/cart/update-item', {
    key: itemKey,
    quantity,
  })
  return data
}

/** Remove an item from the cart */
export async function removeCartItem(itemKey: string): Promise<StoreCart> {
  const { data } = await storeApi.post<StoreCart>('/cart/remove-item', {
    key: itemKey,
  })
  return data
}

/** Update shipping address (to get shipping rates) */
export async function updateShippingAddress(address: {
  first_name?: string
  last_name?: string
  address_1?: string
  city?: string
  state?: string
  postcode?: string
  country: string
}): Promise<StoreCart> {
  const { data } = await storeApi.post<StoreCart>('/cart/update-customer', {
    shipping_address: address,
  })
  return data
}

/** Select a shipping rate */
export async function selectShippingRate(packageId: number, rateId: string): Promise<StoreCart> {
  const { data } = await storeApi.post<StoreCart>('/cart/select-shipping-rate', {
    package_id: packageId,
    rate_id: rateId,
  })
  return data
}

/** Get available payment methods */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await storeApi.get<PaymentMethod[]>('/payment-methods')
  return data
}

/** Place an order */
export async function checkout(payload: {
  billing_address: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    state: string
    postcode: string
    country: string
    email: string
    phone: string
  }
  shipping_address: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    state: string
    postcode: string
    country: string
  }
  payment_method: string
  payment_data?: { key: string; value: string }[]
}): Promise<OrderResult> {
  const { data } = await storeApi.post<OrderResult>('/checkout', payload)
  return data
}

export default storeApi
