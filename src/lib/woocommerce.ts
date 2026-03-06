import axios, { type AxiosError } from 'axios'

const configuredBaseUrl = (import.meta.env.VITE_WC_BASE_URL as string | undefined)
  ?.trim()
  .replace(/\/+$/, '')

// In dev, prefer direct absolute URL if configured (avoids local proxy 404 state).
// In production, keep relative path to work with Vercel rewrites.
const wcBaseURL = import.meta.env.DEV && configuredBaseUrl
  ? `${configuredBaseUrl}/wp-json/wc/v3`
  : '/wp-json/wc/v3'

// Prefer HTTP Basic Auth over query-string auth when keys are present.
// Some hosts block query-string auth; basic auth is safe over HTTPS.
function cleanEnvValue(value: string | undefined): string {
  return (value ?? '').trim().replace(/;+$/, '')
}

const WC_KEY = cleanEnvValue(import.meta.env.VITE_WC_CONSUMER_KEY)
const WC_SECRET = cleanEnvValue(import.meta.env.VITE_WC_CONSUMER_SECRET)
const useBasicAuth = Boolean(WC_KEY && WC_SECRET)
const useQueryAuth = Boolean(WC_KEY || WC_SECRET)

if (import.meta.env.DEV) {
  const target = configuredBaseUrl || '(no VITE_WC_BASE_URL set)'
  const authMode = useBasicAuth ? 'basic' : useQueryAuth ? 'query' : 'none'
  console.info('[wooApi] base=%s target=%s auth=%s', wcBaseURL, target, authMode)
}

// WooCommerce REST API client
export const wooApi = axios.create({
  baseURL: wcBaseURL,
  timeout: 15_000,
  // If both key and secret are available prefer Basic Auth; otherwise
  // fall back to query-string params for environments that require it.
  ...(useBasicAuth
    ? { auth: { username: WC_KEY as string, password: WC_SECRET as string } }
    : useQueryAuth
      ? { params: { consumer_key: WC_KEY, consumer_secret: WC_SECRET } }
      : {}),
})

// ---------- Retry interceptor (handles GoDaddy cold-starts & network blips) ----------
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000 // doubles each attempt

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true                       // network / timeout
  const s = error.response.status
  return s === 408 || s === 429 || s === 502 || s === 503 || s === 504
}

function mapWooError(error: unknown, resource: string): Error {
  if (!axios.isAxiosError(error)) {
    return new Error(`Failed to load ${resource}. Please try again.`)
  }

  if (!error.response) {
    return new Error(`Network error while loading ${resource}. Check API URL/proxy and internet connection.`)
  }

  const status = error.response.status
  if (status === 401 || status === 403) {
    return new Error(`Store authentication failed (${status}) while loading ${resource}. Check Woo API keys and permissions.`)
  }
  if (status === 404) {
    return new Error(`Store endpoint not found (404) while loading ${resource}. Verify VITE_WC_BASE_URL and WordPress permalink/API setup.`)
  }
  if (status >= 500) {
    return new Error(`Store server error (${status}) while loading ${resource}. Please try again in a moment.`)
  }

  return new Error(`Store request failed (${status}) while loading ${resource}.`)
}

wooApi.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as any
  if (!config) return Promise.reject(error)

  config.__retryCount = config.__retryCount ?? 0

  if (config.__retryCount >= MAX_RETRIES || !isRetryable(error)) {
    return Promise.reject(error)
  }

  config.__retryCount += 1
  const delay = RETRY_DELAY_MS * 2 ** (config.__retryCount - 1)
  console.warn(`[wooApi] Retry ${config.__retryCount}/${MAX_RETRIES} in ${delay}ms…`)
  await new Promise(r => setTimeout(r, delay))
  return wooApi.request(config)
})

// ---------- Types ----------

export interface WooProductAttribute {
  id: number
  name: string
  slug: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

export interface WooProduct {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  description: string
  short_description: string
  images: { id: number; src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
  tags: { id: number; name: string; slug: string }[]
  attributes: WooProductAttribute[]
  meta_data: { id: number; key: string; value: string }[]
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  stock_quantity: number | null
  permalink: string
}

export interface WooCategory {
  id: number
  name: string
  slug: string
  description: string
  image: { src: string; alt: string } | null
  count: number
}

// ---------- API Functions ----------

/** Fetch all products (paginated) */
export async function getProducts(params?: {
  per_page?: number
  page?: number
  category?: number
  search?: string
  orderby?: string
  order?: 'asc' | 'desc'
}): Promise<WooProduct[]> {
  try {
    const { data } = await wooApi.get<WooProduct[]>('/products', {
      params: { per_page: 20, ...params },
    })
    return data
  } catch (error) {
    throw mapWooError(error, 'products')
  }
}

/** Fetch a single product by ID */
export async function getProduct(id: number): Promise<WooProduct> {
  try {
    const { data } = await wooApi.get<WooProduct>(`/products/${id}`)
    return data
  } catch (error) {
    throw mapWooError(error, 'product')
  }
}

/** Fetch a single product by slug */
export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  try {
    const { data } = await wooApi.get<WooProduct[]>('/products', {
      params: { slug, per_page: 1 },
    })
    return data[0] ?? null
  } catch (error) {
    throw mapWooError(error, 'product')
  }
}

/** Fetch all categories */
export async function getCategories(params?: {
  per_page?: number
  hide_empty?: boolean
}): Promise<WooCategory[]> {
  try {
    const { data } = await wooApi.get<WooCategory[]>('/products/categories', {
      params: { per_page: 50, hide_empty: true, ...params },
    })
    return data
  } catch (error) {
    throw mapWooError(error, 'categories')
  }
}

export interface WooReview {
  id: number
  date_created: string
  review: string
  rating: number
  reviewer: string
  reviewer_avatar_urls: Record<string, string>
  verified: boolean
}

/** Fetch reviews for a product */
export async function getProductReviews(productId: number, per_page = 20): Promise<WooReview[]> {
  try {
    const { data } = await wooApi.get<WooReview[]>('/products/reviews', {
      params: { product: productId, per_page, status: 'approved' },
    })
    return data
  } catch (error) {
    throw mapWooError(error, 'reviews')
  }
}

export default wooApi
