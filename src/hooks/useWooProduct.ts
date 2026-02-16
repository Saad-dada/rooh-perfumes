import { useState, useEffect } from 'react'
import { getProductBySlug, type WooProduct } from '../lib/woocommerce'

export function useWooProduct(slug: string | undefined) {
  const [product, setProduct] = useState<WooProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    let cancelled = false

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductBySlug(slug!)
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product')
          console.error('WooCommerce product fetch error:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProduct()
    return () => { cancelled = true }
  }, [slug])

  return { product, loading, error }
}
