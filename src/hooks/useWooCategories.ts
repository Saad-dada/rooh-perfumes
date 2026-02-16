import { useState, useEffect } from 'react'
import { getCategories, type WooCategory } from '../lib/woocommerce'

export function useWooCategories() {
  const [categories, setCategories] = useState<WooCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)
        const data = await getCategories()
        if (!cancelled) setCategories(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load categories')
          console.error('WooCommerce categories fetch error:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCategories()
    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}
