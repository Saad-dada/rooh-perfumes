import { useState, useEffect } from 'react'
import { getProducts, type WooProduct } from '../lib/woocommerce'

interface UseWooProductsOptions {
  per_page?: number
  category?: number
  search?: string
}

export function useWooProducts(options: UseWooProductsOptions = {}) {
  const [products, setProducts] = useState<WooProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryIndex, setRetryIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    if (options.per_page === 0) {
      setProducts([])
      setError(null)
      setLoading(false)
      return
    }

    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts(options)
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          setProducts([])
          console.error('WooCommerce fetch error:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [options.per_page, options.category, options.search, retryIndex])

  return {
    products,
    loading,
    error,
    retry: () => setRetryIndex((value) => value + 1),
  }
}
