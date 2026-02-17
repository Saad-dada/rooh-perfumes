import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import LoadingScreen from './components/LoadingScreen'
import ShopPage from './components/ShopPage'
import ProductPage from './components/ProductPage'
import CheckoutPage from './components/CheckoutPage'
import OrderConfirmation from './components/OrderConfirmation'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'

function App() {
  const [loading, setLoading] = useState(true)

  const handleFinished = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-root">
          {loading && <LoadingScreen onFinished={handleFinished} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Routes>
          <CartDrawer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
export default App
