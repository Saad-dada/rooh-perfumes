import { Link, useLocation, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/OrderConfirmation.css'

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const orderResult = (location.state as { orderResult?: { order_id: number; status: string } })?.orderResult

  return (
    <div className="order-page">
      <Navbar />

      <main className="order-main">
        <div className="order-card">
          <div className="order-icon">✓</div>
          <h1 className="order-heading">Thank you for your order!</h1>
          <p className="order-id">Order #{orderId}</p>

          {orderResult && (
            <p className="order-status">
              Status: <strong>{orderResult.status}</strong>
            </p>
          )}

          <p className="order-message">
            We've received your order and will begin processing it shortly.
            You'll receive an email confirmation with your order details.
          </p>

          <Link to="/" className="order-home-btn">
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default OrderConfirmation
