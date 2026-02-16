import { useParams, Link, useNavigate } from 'react-router-dom'
import { useWooProduct } from '../hooks/useWooProduct'
import { useCart } from '../context/CartContext'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ProductPage.css'

// Fallback data when WooCommerce is not configured or product not found
const FALLBACK_PRODUCTS: Record<string, {
  name: string; price: string; shade: string; image: string; description: string
}> = {
  ashq: {
    name: 'Ashq',
    price: '$111',
    shade: 'shade-ashq',
    image: '/perfumes/ashq.png',
    description: 'A passionate fragrance that captures the essence of deep emotion. Rich oud and amber notes intertwine with delicate rose, creating an unforgettable scent.',
  },
  qalb: {
    name: 'Qalb',
    price: '$149',
    shade: 'shade-qalb',
    image: '/perfumes/qalb.png',
    description: 'From the heart, a fragrance that speaks to the soul. Warm sandalwood meets velvety musk, enveloped in whispers of saffron and vanilla.',
  },
  sifr: {
    name: 'Sifr',
    price: '$129',
    shade: 'shade-sifr',
    image: '/perfumes/sifr.png',
    description: 'A journey to the origin. Clean, ethereal notes of white tea and bergamot settle into a base of cedarwood and soft leather.',
  },
  'sahara-saffron': {
    name: 'Sahara Saffron',
    price: '$139',
    shade: 'shade-sahara',
    image: '/perfumes/sahara-saffron.png',
    description: 'Inspired by golden desert sunsets. Precious saffron threads melded with warm amber and smoky incense evoke the mystery of the dunes.',
  },
}

const SHADE_MAP: Record<string, string> = {
  ashq: 'shade-ashq',
  qalb: 'shade-qalb',
  sifr: 'shade-sifr',
  'sahara-saffron': 'shade-sahara',
}

const isWooConfigured =
  import.meta.env.VITE_WC_BASE_URL &&
  !import.meta.env.VITE_WC_BASE_URL.includes('your-wordpress-site')

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { product: wooProduct, loading, error } = useWooProduct(
    isWooConfigured ? slug : undefined
  )

  const fallback = slug ? FALLBACK_PRODUCTS[slug] : undefined

  // Choose data source
  const product = isWooConfigured && wooProduct
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
    : fallback
      ? {
          id: null as number | null,
          name: fallback.name,
          price: fallback.price,
          image: fallback.image,
          imageAlt: fallback.name,
          description: fallback.description,
          shade: fallback.shade,
          inStock: true,
          allImages: [{ id: 0, src: fallback.image, alt: fallback.name }],
        }
      : null

  if (!product && !loading) {
    return (
      <div className="product-page">
        <Navbar />
        <div className="product-not-found">
          <h2>Product not found</h2>
          <Link to="/" className="product-back-link">← Back to shop</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="product-page">
      <Navbar />

      <main className="product-main">
        <Link to="/" className="product-back-link">← Back to shop</Link>

        {loading && isWooConfigured && (
          <div className="product-loading">Loading product…</div>
        )}

        {error && isWooConfigured && (
          <div className="product-error">Could not load live data.</div>
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
                {product.id ? (
                  <>
                    <button
                      className="product-btn product-btn-primary"
                      onClick={async () => {
                        await addToCart(product.id!)
                        navigate('/checkout')
                      }}
                      disabled={!product.inStock}
                    >
                      Buy Now
                    </button>
                    <button
                      className="product-btn product-btn-secondary"
                      onClick={() => addToCart(product.id!)}
                      disabled={!product.inStock}
                    >
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <p className="product-woo-note">
                    Connect WooCommerce to enable purchasing.
                  </p>
                )}
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
