import '../styles/ShopByCategory.css'
import { useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    id: 1,
    slug: 'perfume',
    name: 'Perfume',
    subtitle: 'Timeless Elegance',
    description:
      'Discover our curated collection of luxury perfumes — each bottle crafted to capture moments, memories, and emotions. From bold ouds to delicate florals, find the scent that speaks your soul.',
    image: '/categories/perfume.png',
    bg: '/categories/elements/bg.png',
    decor: '/categories/elements/decor.png',
  },
  {
    id: 2,
    slug: 'bakhoor',
    name: 'Bakhoor',
    subtitle: 'Traditional Luxury',
    description:
      'Immerse your space in the rich, aromatic warmth of authentic bakhoor. Hand-blended with rare resins and precious woods, our bakhoor transforms any room into a sanctuary of calm and tradition.',
    image: '/categories/bakhoor.png',
    bg: '/categories/elements/bg.png',
    decor: '/categories/elements/decor.png',
  },
  {
    id: 3,
    slug: 'body-mist',
    name: 'Body Mist',
    subtitle: 'Light & Refreshing',
    description:
      'Embrace everyday freshness with our collection of body mists — light, airy, and perfectly balanced. Ideal for layering or wearing alone, these scents add a subtle touch of luxury to your daily routine.',
    image: '/categories/bodymist.png',
    bg: '/categories/elements/bg.png',
    decor: '/categories/elements/decor.png',
  },
]

const ShopByCategory = () => {
  const rowsRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    categories.forEach(({ id }) => {
      const bg = document.getElementById(`cat-bg-${id}`)
      const decor = document.getElementById(`cat-decor-${id}`)
      if (bg) bg.style.transform = `rotate(${scrollY * 0.03}deg)`
      if (decor) decor.style.transform = `rotate(${-scrollY * 0.05}deg)`
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Intersection Observer for pop-in effect
  useEffect(() => {
    const rows = rowsRef.current?.querySelectorAll('.cat-row')
    if (!rows) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="sec categories-sec">
      <div className="sec-inner">
        <div className="cat-header">
          <h2 className="cat-section-title">Product Categories</h2>
          <div className="cat-header-image">
            <img src="/elements/6.png" alt="" />
          </div>
          <p className="cat-subtitle">
            Explore our world of fragrance, thoughtfully organized for you.
          </p>
        </div>
        <div className="cat-rows" ref={rowsRef}>
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`cat-row ${index % 2 !== 0 ? 'cat-row--reversed' : ''}`}
            >
              <div className="cat-row__content">
                <h3 className="cat-row__title">{cat.name}</h3>
                <p className="cat-row__subtitle">{cat.subtitle}</p>
                <p className="cat-row__desc">{cat.description}</p>
                <Link to={`/collection/${cat.slug}`} className="cat-row__btn hero-cta">
                  Explore Collection
                  <span className="cat-row__btn-arrow">→</span>
                </Link>
              </div>
              <div className="cat-row__image-wrapper">
                <img src={cat.bg} alt="" className="cat-row__image-bg" id={`cat-bg-${cat.id}`} />
                <img src={cat.image} alt={cat.name} className="cat-row__image-main" />
                <img src={cat.decor} alt="" className="cat-row__image-decor" id={`cat-decor-${cat.id}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategory
