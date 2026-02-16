import { Link } from 'react-router-dom'
import { useWooProducts } from '../hooks/useWooProducts'
import { useCart } from '../context/CartContext'
import '../styles/ShopGrid.css'

// Fallback products shown while WooCommerce is not yet configured
const FALLBACK_PRODUCTS = [
  { name: 'Ashq', price: '$111', shade: 'shade-ashq', image: '/perfumes/ashq.png' },
  { name: 'Qalb', price: '$149', shade: 'shade-qalb', image: '/perfumes/qalb.png' },
  { name: 'Sifr', price: '$129', shade: 'shade-sifr', image: '/perfumes/sifr.png' },
  { name: 'Sahara Saffron', price: '$139', shade: 'shade-sahara', image: '/perfumes/sahara-saffron.png' },
]

// Map WooCommerce product slugs → CSS shade classes
const SHADE_MAP: Record<string, string> = {
  ashq: 'shade-ashq',
  qalb: 'shade-qalb',
  sifr: 'shade-sifr',
  'sahara-saffron': 'shade-sahara',
}

const isWooConfigured =
  import.meta.env.VITE_WC_BASE_URL &&
  !import.meta.env.VITE_WC_BASE_URL.includes('your-wordpress-site')

const ShopGrid = () => {
  const { products: wooProducts, loading, error } = useWooProducts({ per_page: 12 })
  const { addToCart } = useCart()

  // Use WooCommerce products if configured, otherwise fallback
  const useWoo = isWooConfigured && !error && wooProducts.length > 0

  return (
    <section id="shop" className="sec sec-shop">
      <div className="shop-inner">
        <h2 className="shop-title">Our shop</h2>

        {loading && isWooConfigured && (
          <p className="shop-loading">Loading products…</p>
        )}

        {error && isWooConfigured && (
          <p className="shop-error">Could not load products. Showing defaults.</p>
        )}

        <div className="shop-grid">
          {useWoo
            ? wooProducts.map((p) => (
                <article key={p.id} className="shop-card">
                  <Link to={`/product/${p.slug}`} className="shop-card-link">
                    <div className={`shop-card-arch ${SHADE_MAP[p.slug] ?? ''}`}>
                      <img
                        src={p.images[0]?.src ?? '/perfumes/placeholder.png'}
                        alt={p.images[0]?.alt ?? p.name}
                        className="shop-card-img"
                      />
                    </div>
                    <div className="shop-card-info">
                      <h4 className="shop-card-name">{p.name}</h4>
                      <span className="shop-card-price">${p.price}</span>
                    </div>
                  </Link>
                  <button
                    className="shop-card-btn"
                    onClick={() => addToCart(p.id)}
                  >
                    Add to cart
                  </button>
                </article>
              ))
            : FALLBACK_PRODUCTS.map((p) => (
                <article key={p.name} className="shop-card">
                  <Link to={`/product/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="shop-card-link">
                    <div className={`shop-card-arch ${p.shade}`}>
                      <img src={p.image} alt={p.name} className="shop-card-img" />
                    </div>
                    <div className="shop-card-info">
                      <h4 className="shop-card-name">{p.name}</h4>
                      <span className="shop-card-price">{p.price}</span>
                    </div>
                  </Link>
                  <button className="shop-card-btn">Add to cart</button>
                </article>
              ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid
