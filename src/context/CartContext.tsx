import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeCartItem,
  clearCartToken,
  type StoreCart,
  type StoreCartItem,
  formatPrice,
} from '../lib/store-api'

export const CART_SYNC_KEY = 'rooh_cart_updated_at'

interface CartContextValue {
  cart: StoreCart | null
  items: StoreCartItem[]
  itemCount: number
  total: string
  loading: boolean
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemKey: string, quantity: number) => Promise<void>
  removeItem: (itemKey: string) => Promise<void>
  refreshCart: () => Promise<void>
  clearCart: () => void
  syncCheckout: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const fallbackCartContext: CartContextValue = {
  cart: null,
  items: [],
  itemCount: 0,
  total: '$0.00',
  loading: false,
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  refreshCart: async () => {},
  clearCart: () => {},
  syncCheckout: () => {},
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    if (import.meta.env.DEV) {
      console.warn('useCart called outside <CartProvider>; cart actions are disabled for this render.')
    }
    return fallbackCartContext
  }
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const quantityDebounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const queuedQuantityRef = useRef<Map<string, number>>(new Map())
  const inFlightQuantityUpdatesRef = useRef<Set<string>>(new Set())
  const addDebounceTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const queuedAddQuantityRef = useRef<Map<number, number>>(new Map())
  const inFlightAddRef = useRef<Set<number>>(new Set())

  const QUANTITY_DEBOUNCE_MS = 250
  const ADD_DEBOUNCE_MS = 250

  const broadcastCartUpdate = useCallback(() => {
    localStorage.setItem(CART_SYNC_KEY, String(Date.now()))
  }, [])

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCart()
      setCart(data)
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load cart on mount
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  useEffect(() => {
    return () => {
      for (const timer of quantityDebounceTimersRef.current.values()) {
        clearTimeout(timer)
      }
      quantityDebounceTimersRef.current.clear()
      queuedQuantityRef.current.clear()
      inFlightQuantityUpdatesRef.current.clear()
      for (const timer of addDebounceTimersRef.current.values()) {
        clearTimeout(timer)
      }
      addDebounceTimersRef.current.clear()
      queuedAddQuantityRef.current.clear()
      inFlightAddRef.current.clear()
    }
  }, [])

  const applyOptimisticQuantity = useCallback((itemKey: string, quantity: number) => {
    setCart((prev) => {
      if (!prev) return prev

      const nextItems = prev.items.map((item) => {
        if (item.key !== itemKey) return item

        const unitPriceMinor = Number.parseInt(item.prices.price, 10)
        const nextLineTotalMinor = Math.max(unitPriceMinor * quantity, 0)

        return {
          ...item,
          quantity,
          totals: {
            ...item.totals,
            line_subtotal: String(nextLineTotalMinor),
            line_total: String(nextLineTotalMinor),
          },
        }
      })

      const nextItemsCount = nextItems.reduce((sum, item) => sum + item.quantity, 0)
      const nextSubtotalMinor = nextItems.reduce(
        (sum, item) => sum + Number.parseInt(item.totals.line_total, 10),
        0,
      )
      const currentDiscountMinor = Number.parseInt(prev.totals.total_discount ?? '0', 10)
      const nextEstimatedTotalMinor = Math.max(nextSubtotalMinor - currentDiscountMinor, 0)

      return {
        ...prev,
        items: nextItems,
        items_count: nextItemsCount,
        totals: {
          ...prev.totals,
          total_items: String(nextSubtotalMinor),
          total_price: String(nextEstimatedTotalMinor),
        },
      }
    })
  }, [])

  const flushQueuedQuantityUpdate = useCallback(async (itemKey: string) => {
    if (inFlightQuantityUpdatesRef.current.has(itemKey)) return

    const queuedQuantity = queuedQuantityRef.current.get(itemKey)
    if (queuedQuantity == null) return

    inFlightQuantityUpdatesRef.current.add(itemKey)

    try {
      setLoading(true)
      await updateItemQuantity(itemKey, queuedQuantity)
      const latestCart = await getCart()
      setCart(latestCart)
      broadcastCartUpdate()
    } catch (err) {
      console.error('Failed to update quantity:', err)
      const latestCart = await getCart().catch(() => null)
      if (latestCart) setCart(latestCart)
    } finally {
      inFlightQuantityUpdatesRef.current.delete(itemKey)
      setLoading(false)
    }

    const newestQueuedQuantity = queuedQuantityRef.current.get(itemKey)
    if (newestQueuedQuantity == null) return

    if (newestQueuedQuantity !== queuedQuantity) {
      void flushQueuedQuantityUpdate(itemKey)
    }
  }, [broadcastCartUpdate])

  const flushQueuedAddToCart = useCallback(async (productId: number) => {
    if (inFlightAddRef.current.has(productId)) return

    const queuedQuantity = queuedAddQuantityRef.current.get(productId)
    if (queuedQuantity == null || queuedQuantity <= 0) return

    inFlightAddRef.current.add(productId)

    try {
      setLoading(true)
      await addItemToCart(productId, queuedQuantity)
      const latestCart = await getCart()
      setCart(latestCart)
      broadcastCartUpdate()
      setDrawerOpen(true)
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      inFlightAddRef.current.delete(productId)
      setLoading(false)
    }

    const newestQueuedQuantity = queuedAddQuantityRef.current.get(productId)
    if (newestQueuedQuantity == null || newestQueuedQuantity <= 0) {
      queuedAddQuantityRef.current.delete(productId)
      return
    }

    if (newestQueuedQuantity === queuedQuantity) {
      queuedAddQuantityRef.current.delete(productId)
      return
    }

    void flushQueuedAddToCart(productId)
  }, [broadcastCartUpdate])

  const addToCartHandler = useCallback(async (productId: number, quantity = 1) => {
    const nextQuantity = Math.max(1, quantity)
    const currentQueuedQuantity = queuedAddQuantityRef.current.get(productId) ?? 0
    queuedAddQuantityRef.current.set(productId, currentQueuedQuantity + nextQuantity)

    const existingTimer = addDebounceTimersRef.current.get(productId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const nextTimer = setTimeout(() => {
      addDebounceTimersRef.current.delete(productId)
      void flushQueuedAddToCart(productId)
    }, ADD_DEBOUNCE_MS)

    addDebounceTimersRef.current.set(productId, nextTimer)
  }, [flushQueuedAddToCart])

  const updateQuantityHandler = useCallback(async (itemKey: string, quantity: number) => {
    const nextQuantity = Math.max(1, quantity)

    queuedQuantityRef.current.set(itemKey, nextQuantity)
    applyOptimisticQuantity(itemKey, nextQuantity)

    const existingTimer = quantityDebounceTimersRef.current.get(itemKey)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const nextTimer = setTimeout(() => {
      quantityDebounceTimersRef.current.delete(itemKey)
      void flushQueuedQuantityUpdate(itemKey)
    }, QUANTITY_DEBOUNCE_MS)

    quantityDebounceTimersRef.current.set(itemKey, nextTimer)
  }, [applyOptimisticQuantity, flushQueuedQuantityUpdate])

  const removeItemHandler = useCallback(async (itemKey: string) => {
    try {
      setLoading(true)
      await removeCartItem(itemKey)
      const latestCart = await getCart()
      setCart(latestCart)
      broadcastCartUpdate()
    } catch (err) {
      console.error('Failed to remove item:', err)
    } finally {
      setLoading(false)
    }
  }, [broadcastCartUpdate])

  const clearCart = useCallback(() => {
    clearCartToken()
    setCart(null)
    broadcastCartUpdate()
  }, [broadcastCartUpdate])

  /** Build WP sync URL, clear React cart, open WP checkout in new tab */
  const syncCheckout = useCallback(() => {
    const wpUrl = (import.meta.env.VITE_WC_BASE_URL as string).replace(/\/+$/, '')
    const cartItems = cart?.items ?? []
    if (cartItems.length === 0) return

    const param = cartItems.map((i) => `${i.id}:${i.quantity}`).join(',')
    const url = `${wpUrl}/?rooh_sync_cart=${encodeURIComponent(param)}`

    const newTab = window.open(url, '_blank', 'noopener,noreferrer')

    if (newTab) {
      clearCart()
      return
    }

    // Fallback when popups are blocked
    clearCart()
    window.location.href = url
  }, [cart, clearCart])

  const items = cart?.items ?? []
  const itemCount = cart?.items_count ?? 0

  const total = cart
    ? formatPrice(
        cart.totals.total_price,
        cart.totals.currency_minor_unit,
        cart.totals.currency_code,
      )
    : '$0.00'

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        total,
        loading,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        addToCart: addToCartHandler,
        updateQuantity: updateQuantityHandler,
        removeItem: removeItemHandler,
        refreshCart,
        clearCart,
        syncCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
