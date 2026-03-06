
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useWooCategories } from '../hooks/useWooCategories'
import { useWooProducts } from '../hooks/useWooProducts'
import { useCart } from '../context/CartContext'
import { isComingSoon } from '../lib/productUtils'
import '../styles/ShopGrid.css'

type LocalProduct = {
  id: number
  slug: string
  name: string
  price: string
  regular_price?: string
  sale_price?: string
  stock_status?: string
  categories?: { id: number; name: string; slug: string }[]
  images: { src: string; alt?: string }[]
  meta_data?: { key: string; value: unknown }[]
}

const COLLECTION_ROUTES: Record<string, string> = {
  'perfume':   '/collection/perfume',
  'bakhoor':   '/collection/bakhoor',
  'body-mist': '/collection/body-mist',
}

// ── Individual card ────────────────────────────────────────
function ProductCard({ p }: { p: LocalProduct }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const comingSoon = isComingSoon(p)
  const outOfStock = !comingSoon && p.stock_status !== undefined && p.stock_status !== 'instock'

  const cardContent = (
    <>
      <div className="shop-card-arch">
        <img
          src={p.images[0]?.src ?? '/perfumes/placeholder.png'}
          alt={p.images[0]?.alt ?? p.name}
          className="shop-card-img shop-card-img--front"
          loading="lazy"
        />
        {p.images.length > 1 && (
          <img
            src={p.images[p.images.length - 1].src}
            alt={p.images[p.images.length - 1].alt ?? p.name}
            className="shop-card-img shop-card-img--back"
            loading="lazy"
          />
        )}
      </div>
      <div className="shop-card-info">
        <h4 className="shop-card-name">{p.name}</h4>
        <div className="shop-card-pricing">
          {p.sale_price && p.sale_price !== '' && (
            <span className="shop-card-price-old">AED {p.regular_price}</span>
          )}
          <span className="shop-card-price">AED {p.price}</span>
        </div>
      </div>
    </>
  )

  return (
    <article className={`shop-card${comingSoon ? ' shop-card--coming-soon' : ''}`}>
      {comingSoon ? (
        <div className="shop-card-link">{cardContent}</div>
      ) : (
        <Link to={`/product/${p.slug}`} className="shop-card-link">{cardContent}</Link>
      )}
      <button
        className="shop-card-btn"
        disabled={comingSoon || outOfStock || adding}
        onClick={async () => {
          if (comingSoon || outOfStock) return
          setAdding(true)
          try { await addToCart(p.id) } finally { setAdding(false) }
        }}
      >
        {comingSoon ? 'Coming Soon' : outOfStock ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Cart'}
      </button>
    </article>
  )
}

// ── Category row ───────────────────────────────────────────
function CategoryRow({ id, name, slug }: { id: number; name: string; slug: string }) {
  const { products, loading } = useWooProducts({ per_page: 4, category: id })
  const collectionHref = COLLECTION_ROUTES[slug] ?? `/collection/${slug}`
  const displayProducts = [...products].reverse().slice(0, 4)

  return (
    <div className="shop-category-row">
      <div className="shop-category-header">
        <h3 className="shop-category-title">{name}</h3>
        <Link to={collectionHref} className="shop-category-viewall">
          View all <span>→</span>
        </Link>
      </div>
      {loading ? (
        <p className="shop-loading">Loading…</p>
      ) : (
        <div className="shop-grid">
          {displayProducts.map(p => <ProductCard key={p.id} p={p as LocalProduct} />)}
        </div>
      )}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────
const ShopGrid = () => {
  const { categories, loading: catLoading } = useWooCategories()
  const PRIORITY = ['perfume']
  const shopCats = categories
    .filter(c => c.slug !== 'uncategorized' && c.count > 0)
    .sort((a, b) => {
      const ai = PRIORITY.indexOf(a.slug)
      const bi = PRIORITY.indexOf(b.slug)
      if (ai !== -1 && bi === -1) return -1
      if (bi !== -1 && ai === -1) return 1
      return ai - bi
    })

  return (
    <section id="shop" className="sec sec-shop">
      <div className="shop-inner">
        <h2 className="shop-title">Our Shop</h2>
        {catLoading && <p className="shop-loading">Loading…</p>}
        {shopCats.map(cat => (
          <CategoryRow key={cat.id} id={cat.id} name={cat.name} slug={cat.slug} />
        ))}
      </div>
    </section>
  )
}

export default ShopGrid
