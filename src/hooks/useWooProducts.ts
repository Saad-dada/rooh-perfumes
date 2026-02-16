import { useState, useEffect } from 'react'
import { getProducts, type WooProduct } from '../lib/woocommerce'

interface UseWooProductsOptions {
  per_page?: number
  category?: number
}

export function useWooProducts(options: UseWooProductsOptions = {}) {
  const [products, setProducts] = useState<WooProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts(options)
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          console.error('WooCommerce fetch error:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [options.per_page, options.category])

  return { products, loading, error }
}
