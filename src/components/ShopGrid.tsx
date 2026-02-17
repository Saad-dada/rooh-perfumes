
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useWooProducts } from '../hooks/useWooProducts'
import { useCart } from '../context/CartContext'
import '../styles/ShopGrid.css'

type WooProduct = {
  id: number
  slug: string
  name: string
  price: string
  images: { src: string; alt?: string }[]
  // ...other fields as needed
}

interface ShopGridProps {
  products?: WooProduct[]
}

const ShopGrid = ({ products: productsProp }: ShopGridProps) => {
  const { addToCart } = useCart()
  const [addingId, setAddingId] = useState<number | null>(null)
  // If products are passed as a prop, use them; otherwise fetch internally
  const { products, loading, error } = useWooProducts({ per_page: 12 })
  const displayProducts = productsProp ?? products

  return (
    <section id="shop" className="sec sec-shop">
      <div className="shop-inner">
        <h2 className="shop-title">Our shop</h2>

        {!productsProp && loading && (
          <p className="shop-loading">Loading products…</p>
        )}

        {!productsProp && error && (
          <p className="shop-error">Could not load products.</p>
        )}

        <div className="shop-grid">
          {displayProducts.map((p) => (
            <article key={p.id} className="shop-card">
              <Link to={`/product/${p.slug}`} className="shop-card-link">
                <div className={`shop-card-arch`}>
                  <img
                    src={p.images[0]?.src ?? '/perfumes/placeholder.png'}
                    alt={p.images[0]?.alt ?? p.name}
                    className="shop-card-img"
                  />
                </div>
                <div className="shop-card-info">
                  <h4 className="shop-card-name">{p.name}</h4>
                  <span className="shop-card-price">AED{p.price}</span>
                </div>
              </Link>
              <button
                className="shop-card-btn"
                onClick={async () => {
                  setAddingId(p.id)
                  try {
                    await addToCart(p.id)
                  } finally {
                    setAddingId(null)
                  }
                }}
                disabled={
                  // Disable while adding or when out of stock (if provided)
                  (p as any).stock_status !== undefined
                    ? (p as any).stock_status !== 'instock' || addingId === p.id
                    : addingId === p.id
                }
              >
                {addingId === p.id ? 'Adding…' : 'Add to cart'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid
