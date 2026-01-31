import React, { useState, useCallback } from 'react'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

const PAGE_LIMIT = 10

const InfiniteList: React.FC = () => {
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${PAGE_LIMIT}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems((s) => [...s, ...data])
      setHasMore(data.length === PAGE_LIMIT)
      setPage((p) => p + 1)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [page, loading])

  const sentinelRef = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMore })

  return (
    <div style={{ padding: 20 }}>
      <h3>Demo Infinite List</h3>
      <ul>
        {items.map((i) => (
          <li key={i.id} style={{ marginBottom: 10 }}>
            <strong>{i.id}.</strong> {i.title}
          </li>
        ))}
      </ul>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div ref={sentinelRef as any} style={{ height: 1 }} />
      {loading && <div>Loading…</div>}
      {!hasMore && <div>No more items</div>}
      <button onClick={loadMore} disabled={loading || !hasMore} style={{ marginTop: 10 }}>
        Load more
      </button>
    </div>
  )
}

export default InfiniteList
