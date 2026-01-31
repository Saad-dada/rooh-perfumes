import { useEffect, useRef } from 'react'

type Params = {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  root?: Element | null
  rootMargin?: string
}

export default function useInfiniteScroll({ loading, hasMore, onLoadMore, root = null, rootMargin = '200px' }: Params) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (loading) return
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onLoadMore()
        })
      },
      { root: root ?? null, rootMargin }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [loading, hasMore, onLoadMore, root, rootMargin])

  return sentinelRef
}
