import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'

const Home = lazy(() => import('./Home'))
const ShopPage = lazy(() => import('./components/ShopPage'))
const ProductPage = lazy(() => import('./components/ProductPage'))
const CollectionPerfume = lazy(() => import('./components/CollectionPerfume'))
const CollectionBakhoor = lazy(() => import('./components/CollectionBakhoor'))
const CollectionBodyMist = lazy(() => import('./components/CollectionBodyMist'))
const CheckoutPage = lazy(() => import('./components/CheckoutPage'))
const CheckoutReviewPage = lazy(() => import('./components/CheckoutReviewPage'))
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'))
const AboutPage = lazy(() => import('./components/AboutPage'))
const ContactPage = lazy(() => import('./components/ContactPage'))
const TermsAndConditionPage = lazy(() => import('./components/TermsAndConditionPage'))
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'))
const CartDrawer = lazy(() => import('./components/CartDrawer'))

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-root">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collection/perfume" element={<CollectionPerfume />} />
              <Route path="/collection/bakhoor" element={<CollectionBakhoor />} />
              <Route path="/collection/deodorant" element={<CollectionBodyMist />} />
              <Route path="/collection/body-mist" element={<CollectionBodyMist />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout-review" element={<CheckoutReviewPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/terms" element={<TermsAndConditionPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
            <CartDrawer />
          </Suspense>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
export default App
