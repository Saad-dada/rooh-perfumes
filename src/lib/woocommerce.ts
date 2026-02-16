import axios from 'axios'

// In dev mode, use relative path so Vite proxy handles CORS
const isDev = import.meta.env.DEV
const wcBaseURL = isDev
  ? '/wp-json/wc/v3'
  : `${import.meta.env.VITE_WC_BASE_URL}/wp-json/wc/v3`

// WooCommerce REST API client
export const wooApi = axios.create({
  baseURL: wcBaseURL,
  params: {
    consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
    consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET,
  },
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
