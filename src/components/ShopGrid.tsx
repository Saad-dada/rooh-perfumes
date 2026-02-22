
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
  // If products are passed as a prop, use them; otherwise fetch a small grid set
  const { products, loading, error } = useWooProducts({ per_page: 4 })
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
          {[...displayProducts].slice().reverse().map((p) => (
            <article key={p.id} className="shop-card">
              <Link to={`/product/${p.slug}`} className="shop-card-link">
                <div className={`shop-card-arch`}>
                  <img
                    src={p.images[0]?.src ?? '/perfumes/placeholder.png'}
                    alt={p.images[0]?.alt ?? p.name}
                    className="shop-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="shop-card-info">
                  {((p as any).categories ?? []).length > 0 && (
                    <span className="sp-card-category">{(p as any).categories[0].name}</span>
                  )}
                  <h4 className="shop-card-name">{p.name}</h4>
                  <div className="shop-card-pricing">
                    {(p as any).sale_price && (
                      <span className="shop-card-price-old">AED {(p as any).regular_price}</span>
                    )}
                    <span className="shop-card-price">AED {p.price}</span>
                  </div>
                </div>
              </Link>
              <button
                className="shop-card-btn"
                onClick={async () => {
                  const stock = (p as any).stock_status
                  const outOfStock = stock !== undefined ? stock !== 'instock' : false
                  if (outOfStock) return
                  setAddingId(p.id)
                  try {
                    await addToCart(p.id)
                  } finally {
                    setAddingId(null)
                  }
                }}
                data-stock={
                  ((p as any).stock_status !== undefined && (p as any).stock_status !== 'instock') ? 'out' : 'in'
                }
                disabled={
                  ((p as any).stock_status !== undefined
                    ? (p as any).stock_status !== 'instock'
                    : false) || addingId === p.id
                }
              >
                {addingId === p.id
                  ? 'Adding…'
                  : (p as any).stock_status !== undefined && (p as any).stock_status !== 'instock'
                    ? 'Coming Soon'
                    : 'Add to Cart'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid
