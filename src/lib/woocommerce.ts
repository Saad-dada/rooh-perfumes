import axios, { type AxiosError } from 'axios'

// Always use relative path — Vite proxy (dev) and Vercel rewrites (prod)
// both forward /wp-json/* to the WordPress backend
const wcBaseURL = '/wp-json/wc/v3'

// WooCommerce REST API client
export const wooApi = axios.create({
  baseURL: wcBaseURL,
  timeout: 15_000,
  params: {
    consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
    consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET,
  },
})

// ---------- Retry interceptor (handles GoDaddy cold-starts & network blips) ----------
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000 // doubles each attempt

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true                       // network / timeout
  const s = error.response.status
  return s === 408 || s === 429 || s === 502 || s === 503 || s === 504
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
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
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
  const { data } = await wooApi.get<WooProduct[]>('/products', {
    params: { per_page: 20, ...params },
  })
  return data
}

/** Fetch a single product by ID */
export async function getProduct(id: number): Promise<WooProduct> {
  const { data } = await wooApi.get<WooProduct>(`/products/${id}`)
  return data
}

/** Fetch a single product by slug */
export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const { data } = await wooApi.get<WooProduct[]>('/products', {
    params: { slug, per_page: 1 },
  })
  return data[0] ?? null
}

/** Fetch all categories */
export async function getCategories(params?: {
  per_page?: number
  hide_empty?: boolean
}): Promise<WooCategory[]> {
  const { data } = await wooApi.get<WooCategory[]>('/products/categories', {
    params: { per_page: 50, hide_empty: true, ...params },
  })
  return data
}

export default wooApi
