import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeCartItem,
  type StoreCart,
  type StoreCartItem,
  formatPrice,
} from '../lib/store-api'

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
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

const isWooConfigured =
  import.meta.env.VITE_WC_BASE_URL &&
  !import.meta.env.VITE_WC_BASE_URL.includes('your-wordpress-site')

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isWooConfigured) return
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

  const addToCartHandler = useCallback(async (productId: number, quantity = 1) => {
    if (!isWooConfigured) return
    try {
      setLoading(true)
      const data = await addItemToCart(productId, quantity)
      setCart(data)
      setDrawerOpen(true)
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuantityHandler = useCallback(async (itemKey: string, quantity: number) => {
    if (!isWooConfigured) return
    try {
      setLoading(true)
      const data = await updateItemQuantity(itemKey, quantity)
      setCart(data)
    } catch (err) {
      console.error('Failed to update quantity:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const removeItemHandler = useCallback(async (itemKey: string) => {
    if (!isWooConfigured) return
    try {
      setLoading(true)
      const data = await removeCartItem(itemKey)
      setCart(data)
    } catch (err) {
      console.error('Failed to remove item:', err)
    } finally {
      setLoading(false)
    }
  }, [])

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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
