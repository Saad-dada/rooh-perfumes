import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
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
        price: wooProduct.price,
        regular_price: wooProduct.regular_price,
        sale_price: wooProduct.sale_price,
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
        <Link to="/shop" className="product-back-link" data-discover="true">← Back to shop</Link>

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
              <div className="product-hero-wrap">
                <div className="product-hero-card">
                  <Gallery allImages={product.allImages} shade={product.shade} />
                </div>
                <div className="product-hero-thumbs">
                  {/* Thumbs rendered inside Gallery already, keep this area for spacing */}
                </div>
              </div>
            </div>

            {/* Product info */}
            <aside className="product-info card"> 
              <h1 className="product-name">{product.name}</h1>
              <div>
                {product.sale_price && product.sale_price !== '' ? (
                  <>
                    <span className="product-price">AED {product.sale_price}</span>
                    <span className="product-price-old">AED {product.regular_price}</span>
                  </>
                ) : (
                  <span className="product-price">AED {product.price}</span>
                )}
              </div>

              <div className="product-meta">
                {product.inStock ? 'Available to ship' : 'Currently unavailable'}
              </div>

              {/* Key notes (if present in description as simple comma list) */}
              {(() => {
                // try to extract a short 'key notes' line from description heuristically
                const desc = product.description || ''
                const match = desc.match(/Key notes[:\-]?\s*([\s\S]{0,200})/i)
                if (match && match[1]) {
                  const notes = match[1].split(/[\.|\n]/)[0]
                  return (
                    <div className="product-keynotes">
                      <strong>Key notes:</strong>
                      <span>{notes.trim()}</span>
                    </div>
                  )
                }
                return null
              })()}

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
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductPage

// Small gallery component for ProductPage (keeps file simple)
function Gallery({ allImages, shade }: { allImages: { src: string; alt?: string }[]; shade?: string }) {
  const [index, setIndex] = useState(0)
  const main = allImages[index] ?? allImages[0]

  return (
    <>
      <div className={`product-image-main ${shade}`}>
        <img src={main?.src ?? '/perfumes/placeholder.png'} alt={main?.alt ?? ''} className="product-hero-img" />
      </div>
      {allImages.length > 1 && (
        <div className="product-thumbs">
          {allImages.map((img, i) => (
            <div
              key={i}
              className={`product-thumb ${i === index ? 'product-thumb--active' : ''}`}
              onClick={() => setIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={() => setIndex(i)}
            >
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
