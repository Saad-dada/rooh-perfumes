import Navbar from './Navbar'
import Footer from './Footer'
import { useWooCategories } from '../hooks/useWooCategories'
import { useWooProducts } from '../hooks/useWooProducts'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import '../styles/ShopPage.css'
import '../styles/ShopByCategory.css'
import '../styles/CollectionPerfume.css'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

interface ParsedProduct {
  keyNotes: string[]
  prose: string
}

function parseDescription(
  html: string,
  attrs: { name: string; options: string[] }[] = []
): ParsedProduct {
  // Prefer the "Key Notes" product attribute if present
  const notesFromAttr = attrs
    .find(a => /^key\s*notes?$/i.test(a.name))
    ?.options ?? []

  const text = stripHtml(html)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  let keyNotesFromDesc: string[] = []
  let proseLines: string[] = []

  for (const line of lines) {
    const notesMatch = line.match(/^key notes[:\-—]?\s*(.+)/i)
    if (notesMatch) {
      keyNotesFromDesc = notesMatch[1].split(/,\s*/).map(n => n.trim()).filter(Boolean)
      continue
    }
    if (/^(description|ingredients|size|volume|how to use|directions)\.?$/i.test(line)) continue
    proseLines.push(line)
  }

  // Trim prose to ~220 chars at sentence boundary
  let prose = proseLines.join(' ').replace(/\s+/g, ' ').trim()
  if (prose.length > 220) {
    const cut = prose.slice(0, 220)
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('…'))
    prose = lastStop > 80 ? prose.slice(0, lastStop + 1) : cut.replace(/\s+\S*$/, '') + '…'
  }

  return {
    keyNotes: notesFromAttr.length > 0 ? notesFromAttr : keyNotesFromDesc,
    prose,
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

const CollectionPerfume = () => {
  const rowsRef = useRef<HTMLDivElement>(null)
  const { categories } = useWooCategories()
  const perfumeCat = categories.find((c) => c.slug === 'perfume')
  const catId = perfumeCat?.id

  const { products, loading } = useWooProducts(catId ? { per_page: 8, category: catId } : { per_page: 8 })

  useEffect(() => {
    const rows = rowsRef.current?.querySelectorAll('.cp-row')
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
      { threshold: 0.1 }
    )
    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [products])

  return (
    <div className="shop-page">
      <Navbar />

      <header className="cp-hero">
        <div className="cp-hero-inner">
          <span className="cp-hero-eyebrow">2026 Collection</span>
          <h1 className="cp-hero-title">Perfumes</h1>
          <p className="cp-hero-sub">Timeless Elegance — curated fragrances, each with a soul of its own</p>
        </div>
      </header>

      <main className="cp-main">
        {loading && (
          <div className="sp-loading">
            <div className="sp-spinner" />
            <p>Loading collection…</p>
          </div>
        )}
        {!loading && products.length === 0 && (
          <p className="cp-empty">No perfumes found.</p>
        )}

        <div className="cp-rows" ref={rowsRef}>
          {!loading && products.slice().reverse().filter(p => !p.name.toLowerCase().includes('sahara')).map((p, i) => {
            const rawHtml = p.short_description || p.description || ''
            const { keyNotes, prose } = parseDescription(rawHtml, (p as any).attributes ?? [])
            const isReversed = i % 2 !== 0

            return (
              <article key={p.id} className={`cp-row${isReversed ? ' cp-row--flip' : ''}`} data-row-index={i}>

                {/* ── Image side ── */}
                <div className="cp-row__visual">
                  <div className="cp-row__img-wrap">
                    <img
                      src={p.images[0]?.src ?? '/perfumes/placeholder.png'}
                      alt={p.images[0]?.alt ?? p.name}
                      className="cp-row__img-main cp-row__img-front"
                    />
                    {p.images.length > 1 && (
                      <img
                        src={p.images[p.images.length - 1].src}
                        alt={(p.images[p.images.length - 1] as any).alt ?? p.name}
                        className="cp-row__img-main cp-row__img-back"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

                {/* ── Content side ── */}
                <div className="cp-row__content">

                  <span className="cp-row__category">
                    {p.categories[0]?.name ?? 'Fragrance'}
                  </span>

                  <h2 className="cp-row__name">{p.name}</h2>

                  {keyNotes.length > 0 && (
                    <div className="cp-row__notes">
                      <span className="cp-row__notes-label">Key notes</span>
                      <div className="cp-row__notes-pills">
                        {keyNotes.map(note => (
                          <span key={note} className="cp-row__note-pill">{note}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prose && (
                    <p className="cp-row__prose">{prose}</p>
                  )}

                  <div className="cp-row__footer">
                    <div className="cp-row__pricing">
                      {p.sale_price && p.sale_price !== '' ? (
                        <>
                          <span className="cp-row__price-old">AED {p.regular_price}</span>
                          <span className="cp-row__price">AED {p.sale_price}</span>
                        </>
                      ) : (
                        <span className="cp-row__price">AED {p.price}</span>
                      )}
                    </div>

                    <div className="cp-row__stock">
                      {p.stock_status === 'instock'
                        ? <span className="cp-row__in-stock">● In stock</span>
                        : <span className="cp-row__out-stock">● Coming soon</span>}
                    </div>
                  </div>

                  <Link to={`/product/${p.slug}`} className="cp-row__cta hero-cta">
                    Discover <span className="hero-cta-arrow">→</span>
                  </Link>

                </div>
              </article>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CollectionPerfume
