import { useState, useEffect } from 'react'
import { getProductReviews, type WooReview } from '../lib/woocommerce'

export function useWooReviews(productId: number | undefined) {
  const [reviews, setReviews] = useState<WooReview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) return
    let cancelled = false

    async function fetchReviews() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductReviews(productId!)
        if (!cancelled) setReviews(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load reviews')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchReviews()
    return () => { cancelled = true }
  }, [productId])

  return { reviews, loading, error }
}
