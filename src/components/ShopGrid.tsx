import { Link } from 'react-router-dom'
import { useWooProducts } from '../hooks/useWooProducts'
import { useCart } from '../context/CartContext'
import '../styles/ShopGrid.css'

// Map WooCommerce product slugs → CSS shade classes
const SHADE_MAP: Record<string, string> = {
  ashq: 'shade-ashq',
  qalb: 'shade-qalb',
  sifr: 'shade-sifr',
  'sahara-saffron': 'shade-sahara',
}

const ShopGrid = () => {
  const { products, loading, error } = useWooProducts({ per_page: 12 })
  const { addToCart } = useCart()

  return (
    <section id="shop" className="sec sec-shop">
      <div className="shop-inner">
        <h2 className="shop-title">Our shop</h2>

        {loading && (
          <p className="shop-loading">Loading products…</p>
        )}

        {error && (
          <p className="shop-error">Could not load products.</p>
        )}

        <div className="shop-grid">
          {products.map((p) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid
