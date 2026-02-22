import Navbar from './Navbar'
import Footer from './Footer'
import { useWooCategories } from '../hooks/useWooCategories'
import { useWooProducts } from '../hooks/useWooProducts'
import { Link } from 'react-router-dom'
import '../styles/ShopPage.css'
import '../styles/ShopByCategory.css'

const CollectionPerfume = () => {
  const { categories } = useWooCategories()
  // Try to find a category with slug 'perfume'
  const perfumeCat = categories.find((c) => c.slug === 'perfume')
  const catId = perfumeCat?.id

  const { products, loading } = useWooProducts(catId ? { per_page: 4, category: catId } : { per_page: 4 })

  return (
    <div className="shop-page">
      <Navbar />
      <header className="sp-hero">
        <div className="sp-hero-inner">
          <h1 className="sp-hero-title">Perfume Collection</h1>
          <p className="sp-hero-subtitle">Timeless Elegance — curated perfumes from our collection</p>
        </div>
      </header>

      <main className="sp-main">
        <section className="sec categories-sec">
          <div className="sec-inner">
            <div className="cat-rows">
              {loading && <p>Loading perfumes…</p>}
              {!loading && products.length === 0 && <p>No perfumes found.</p>}
              {!loading && products.slice().reverse().map((p, i) => (
                <div key={p.id} className={`cat-row in-view ${i % 2 !== 0 ? 'cat-row--reversed' : ''}`}>
                  <div className="cat-row__content">
                    <h3 className="cat-row__title">{p.name}</h3>
                    <p className="cat-row__subtitle">{p.categories[0]?.name ?? 'Perfume'}</p>
                    <p className="cat-row__desc" dangerouslySetInnerHTML={{ __html: p.short_description || p.description || '' }} />
                    <Link to={`/product/${p.slug}`} className="cat-row__btn hero-cta">Discover <span className="cat-row__btn-arrow">→</span></Link>
                  </div>
                  <div className="cat-row__image-wrapper">
                    <img src="/categories/elements/bg.png" alt="" className="cat-row__image-bg" />
                    <img src={p.images[0]?.src ?? '/perfumes/placeholder.png'} alt={p.images[0]?.alt ?? p.name} className="cat-row__image-main" />
                    <img src="/categories/elements/decor.png" alt="" className="cat-row__image-decor" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CollectionPerfume
