import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWooProduct } from '../hooks/useWooProduct'
import { useWooProducts } from '../hooks/useWooProducts'
import { useCart } from '../context/CartContext'
import { getProductVolume } from '../lib/productUtils'
import { clearCartToken } from '../lib/store-api'
import type { WooProduct, WooProductAttribute } from '../lib/woocommerce'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ProductPage.css'

const WP_URL = (import.meta.env.VITE_WC_BASE_URL as string).replace(/\/+$/, '')

// ── Helpers ────────────────────────────────────────────────────────────────

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

/** Find an attribute by partial name match, return its options array */
function attrOptions(attrs: WooProductAttribute[], name: string): string[] {
  return attrs.find(a => a.name.toLowerCase().includes(name.toLowerCase()))?.options ?? []
}

interface ParsedDesc { keyNotes: string[]; volume: string | null; prose: string }

function parseDescription(html: string, attrs: WooProductAttribute[]): ParsedDesc {
  // 1. Prefer the explicit "Key Notes" attribute — avoids pulling in "Fragrance Family"
  const notesFromAttr = attrOptions(attrs, 'key notes')
  const volumeFromAttr = attrOptions(attrs, 'size')[0]
    ?? attrOptions(attrs, 'volume')[0]
    ?? attrOptions(attrs, 'ml')[0]
    ?? null

  // 2. Fall back to parsing description text
  const text = stripHtml(html)
  const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean)
  let keyNotesFromDesc: string[] = []
  let volumeFromDesc: string | null = null
  const proseLines: string[] = []

  for (const line of lines) {
    const notesMatch = line.match(/^key notes[:\-—]?\s*(.+)/i)
    if (notesMatch) {
      keyNotesFromDesc = notesMatch[1].split(/,\s*/).map((n: string) => n.trim()).filter(Boolean)
      continue
    }
    const volMatch = line.match(/^(?:size|volume)[:\-—]?\s*(.+)/i)
    if (volMatch) { volumeFromDesc = volMatch[1].trim(); continue }
    if (/^(description|ingredients|how to use|directions|notes?)\.?:?\s*$/i.test(line)) continue
    proseLines.push(line)
  }

  return {
    keyNotes: notesFromAttr.length > 0 ? notesFromAttr : keyNotesFromDesc,
    volume: volumeFromAttr ?? volumeFromDesc,
    prose: proseLines.join(' ').replace(/\s+/g, ' ').trim(),
  }
}

// ── Video embed helper ────────────────────────────────────────────────────
function getVideoEmbed(url: string): { type: 'iframe'; src: string } | { type: 'video'; src: string } | null {
  try {
    const u = new URL(url)
    // YouTube
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      const id = u.searchParams.get('v')
      if (!id) return null
      return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?rel=0` }
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1)
      if (!id) return null
      return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?rel=0` }
    }
    // Vimeo
    if (u.hostname === 'vimeo.com' || u.hostname === 'www.vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (!id) return null
      return { type: 'iframe', src: `https://player.vimeo.com/video/${id}` }
    }
    // Direct video file
    if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) {
      return { type: 'video', src: url }
    }
    return null
  } catch {
    return null
  }
}

// ── Component ──────────────────────────────────────────────────────────────

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const { product: wooProduct, loading, error, retry } = useWooProduct(slug)

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Block Sahara Saffron — Coming Soon
  if (!loading && wooProduct && wooProduct.name.toLowerCase().includes('sahara')) {
    return (
      <div className="product-page">
        <Navbar />
        <div className="product-not-found" style={{ textAlign: 'center', padding: '140px 24px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.4rem', marginBottom: '12px' }}>Coming Soon</h2>
          <p style={{ color: 'rgba(0,0,0,0.45)', fontFamily: "'Instrument Sans', sans-serif", marginBottom: '32px' }}>This fragrance is not yet available. Stay tuned.</p>
          <Link to="/shop" className="hero-cta">← Back to shop</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const parsed = wooProduct
    ? parseDescription(wooProduct.description || wooProduct.short_description, wooProduct.attributes ?? [])
    : null

  // Visible attributes for the spec table — only exclude Key Notes (shown as pills) and Volume (shown in pricing row)
  const specAttrs = (wooProduct?.attributes ?? []).filter(a =>
    a.visible &&
    !/^key\s*notes?$/i.test(a.name) &&
    !/^(size|volume)$/i.test(a.name)
  )

  const shortDesc = wooProduct?.short_description ? stripHtml(wooProduct.short_description).trim() : ''
  const tags = wooProduct?.tags ?? []
  const rawVideoUrl = wooProduct?.meta_data?.find(m => m.key === 'video_url')?.value ?? ''
  const videoEmbed = rawVideoUrl ? getVideoEmbed(rawVideoUrl) : null

  const product = wooProduct
    ? {
        id: wooProduct.id,
        name: wooProduct.name,
        price: wooProduct.price,
        regular_price: wooProduct.regular_price,
        sale_price: wooProduct.sale_price,
        categories: wooProduct.categories,
        inStock: wooProduct.stock_status === 'instock',
        stockQty: wooProduct.stock_quantity,
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
        <Link to="/shop" className="product-back-link">← Back</Link>

        {loading && <div className="product-loading">Loading product…</div>}

        {error && (
          <div className="product-error">
            <div>{error}</div>
            <button className="product-btn product-btn-secondary" onClick={retry}>Retry</button>
          </div>
        )}

        {product && parsed && (
          <>
            <div className="product-layout">
              {/* ── Gallery (left on desktop) ── */}
              <div className="product-gallery">
                <Gallery allImages={product.allImages} />
              </div>

              {/* ── Info (right on desktop, reordered via display:contents on mobile) ── */}
              <div className="product-info">
                {/* ── Heading ── */}
                <header className="product-header">
                  {product.categories.length > 0 && (
                    <span className="product-category-tag">{product.categories[0].name}</span>
                  )}
                  <h1 className="product-name">{product.name}</h1>
                  <div className="product-pricing">
                    {product.sale_price && product.sale_price !== '' ? (
                      <>
                        <span className="product-price">AED {product.sale_price}</span>
                        <span className="product-price-old">AED {product.regular_price}</span>
                      </>
                    ) : (
                      <span className="product-price">AED {product.price}</span>
                    )}
                    {parsed.volume && <span className="product-volume">{parsed.volume}</span>}
                  </div>
                </header>

                {/* ── Stock + Actions ── */}
                <div className="product-actions-block">
                  <div className="product-stock">
                    {product.inStock
                      ? <span className="product-stock-in">● In Stock — ready to ship</span>
                      : <span className="product-stock-out">● Currently unavailable</span>}
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
                      onClick={async () => {
                        setAdding(true)
                        await addToCart(product.id)
                        setAdding(false)
                      }}
                      disabled={!product.inStock || adding}
                    >
                      {adding ? 'Adding…' : 'Add to Cart'}
                    </button>
                  </div>
                </div>

                <div className="product-details-divider" />

                {/* ── Details ── */}
                <div className="product-details">
                  {shortDesc && <p className="product-short-desc">{shortDesc}</p>}

                  {parsed.keyNotes.length > 0 && (
                    <div className="product-notes-section">
                      <span className="product-notes-label">Key Notes</span>
                      <div className="product-notes-pills">
                        {parsed.keyNotes.map(note => (
                          <span key={note} className="product-note-pill">{note}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsed.prose && <p className="product-prose">{parsed.prose}</p>}

                  {specAttrs.length > 0 && (
                    <dl className="product-specs">
                      {specAttrs.map(attr => (
                        <div key={attr.id} className="product-spec-row">
                          <dt>{attr.name}</dt>
                          <dd>{attr.options.join(', ')}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {tags.length > 0 && (
                    <div className="product-tags">
                      {tags.map(tag => (
                        <span key={tag.id} className="product-tag">{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>{/* end product-info */}
            </div>{/* end product-layout */}

            {/* ── Video ── */}
            {videoEmbed && (
              <div className="product-video-section">
                <h2 className="product-video-heading">Watch</h2>
                {videoEmbed.type === 'iframe' ? (
                  <div className="product-video-wrapper">
                    <iframe
                      src={videoEmbed.src}
                      title={`${product.name} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="product-video-wrapper">
                    <video src={videoEmbed.src} controls playsInline />
                  </div>
                )}
              </div>
            )}

            {/* ── Related Products ── */}
            <RelatedProducts currentId={product.id} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductPage

// ── Related Products ───────────────────────────────────────────────────────
function RelatedProducts({ currentId }: { currentId: number }) {
  const { products } = useWooProducts({ per_page: 8 })
  const related = products
    .filter(p => p.id !== currentId && !p.name.toLowerCase().includes('sahara'))
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="rp-section">
      <h2 className="rp-heading">You May Also Like</h2>
      <div className="rp-grid">
        {related.map(p => (
          <RelatedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ product: p }: { product: WooProduct }) {
  const img = p.images[0]
  const isSale = p.sale_price && p.sale_price !== ''
  const volume = getProductVolume(p)

  return (
    <Link to={`/product/${p.slug}`} className="rp-card">
      <div className="rp-card-arch">
        <img src={img?.src ?? '/perfumes/placeholder.png'} alt={img?.alt ?? p.name} className="rp-card-img" loading="lazy" />
      </div>
      <div className="rp-card-body">
        <p className="rp-card-name">{p.name}</p>
        <div className="rp-card-pricing">
          {isSale ? (
            <>
              <span className="rp-card-price">AED {p.sale_price}</span>
              <span className="rp-card-price-old">AED {p.regular_price}</span>
            </>
          ) : (
            <span className="rp-card-price">AED {p.price}</span>
          )}
          {volume && <span className="rp-card-volume">{volume}</span>}
        </div>
      </div>
    </Link>
  )
}

// ── Gallery ────────────────────────────────────────────────────────────────
function Gallery({ allImages }: { allImages: { src: string; alt?: string }[] }) {
  const imgs = allImages.length > 0 ? allImages : [{ src: '/perfumes/placeholder.png', alt: '' }]
  const [active, setActive] = useState(0)

  return (
    <div className="product-gallery-inner">
      {/* Desktop: all images stacked */}
      <div className="gallery-stack">
        {imgs.map((im, i) => (
          <div key={i} className="product-image-main">
            <img
              src={im.src}
              alt={im.alt ?? ''}
              className="product-hero-img"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>

      {/* Mobile: single active image + thumbnail strip */}
      <div className="gallery-single">
        <div className="product-image-main">
          <img
            src={imgs[active].src}
            alt={imgs[active].alt ?? ''}
            className="product-hero-img"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        {imgs.length > 1 && (
          <div className="product-thumbs">
            {imgs.map((im, i) => (
              <button
                key={i}
                type="button"
                className={`product-thumb${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={im.src} alt={im.alt ?? ''} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
