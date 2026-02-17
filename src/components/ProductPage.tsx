import { useParams, Link } from 'react-router-dom'
import { useWooProduct } from '../hooks/useWooProduct'
import { useCart } from '../context/CartContext'
import { clearCartToken } from '../lib/store-api'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ProductPage.css'

const WP_URL = (import.meta.env.VITE_WC_BASE_URL as string).replace(/\/+$/, '')

const SHADE_MAP: Record<string, string> = {
  ashq: 'shade-ashq',
  qalb: 'shade-qalb',
  sifr: 'shade-sifr',
  'sahara-saffron': 'shade-sahara',
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { addToCart } = useCart()
  const { product: wooProduct, loading, error } = useWooProduct(slug)

  const product = wooProduct
    ? {
        id: wooProduct.id,
        name: wooProduct.name,
        price: `$${wooProduct.price}`,
        image: wooProduct.images[0]?.src ?? '/perfumes/placeholder.png',
        imageAlt: wooProduct.images[0]?.alt ?? wooProduct.name,
        description: wooProduct.short_description || wooProduct.description,
        shade: SHADE_MAP[wooProduct.slug] ?? '',
        inStock: wooProduct.stock_status === 'instock',
        allImages: wooProduct.images,
      }
    : null

  if (!product && !loading) {
    return (
      <div className="product-page">
        <Navbar />
        <div className="product-not-found">
          <h2>Product not found</h2>
          <Link to="/shop" className="product-back-link">← Back to shop</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="product-page">
      <Navbar />

      <main className="product-main">
        <Link to="/shop" className="product-back-link">← Back to shop</Link>

        {loading && (
          <div className="product-loading">Loading product…</div>
        )}

        {error && (
          <div className="product-error">Could not load product.</div>
        )}

        {product && (
          <div className="product-layout">
            {/* Image gallery */}
            <div className="product-gallery">
              <div className={`product-image-main ${product.shade}`}>
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="product-hero-img"
                />
              </div>
              {product.allImages.length > 1 && (
                <div className="product-thumbs">
                  {product.allImages.map((img, i) => (
                    <div key={i} className="product-thumb">
                      <img src={img.src} alt={img.alt} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="product-info">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-price">{product.price}</p>

              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div className="product-stock">
                {product.inStock ? (
                  <span className="product-stock-in">● In Stock</span>
                ) : (
                  <span className="product-stock-out">● Out of Stock</span>
                )}
              </div>

              <div className="product-actions">
                <button
                  className="product-btn product-btn-primary"
                  onClick={() => {
                    clearCartToken()
                    window.location.href = `${WP_URL}/?rooh_sync_cart=${product.id}:1`
                  }}
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
                <button
                  className="product-btn product-btn-secondary"
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductPage
