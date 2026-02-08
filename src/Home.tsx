import Hero from './components/Hero'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      {/* ── Navbar ── */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-links nav-left">
            <a href="#">HOME</a>
            <a href="#shop">SHOP</a>
          </div>

          <a href="#" className="nav-brand">
            <img src="/roohlogo.png" alt="Rooh Perfumes" className="nav-logo" />
          </a>

          <div className="nav-links nav-right">
            <a href="#about">ABOUT</a>
            <a href="#contact">CONTACT</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-social" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* ── 3D Hero ── */}
      <Hero />

      {/* ── Shop By Category ── */}
      <section className="sec categories-sec">
        <div className="sec-inner">
          <h2 className="sec-title center-text">Shop By Category</h2>
          <div className="cat-grid">
            {[
              { name: 'BESTSELLERS', color: '#f5ddd5' },
              { name: 'NEW ARRIVALS', color: '#f0dcc4' },
              { name: 'FLORAL', color: '#e8d5e8' },
              { name: 'WOODY', color: '#d4b48f' },
              { name: 'ORIENTAL', color: '#c9956b' },
              { name: 'FRESH', color: '#d5e8d5' },
              { name: 'OUD', color: '#b08968' },
              { name: 'GIFT SETS', color: '#f2ecd0' },
            ].map((cat) => (
              <a key={cat.name} href="#shop" className="cat-item">
                <div className="cat-circle" style={{ background: cat.color }} />
                <span className="cat-name">{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee Banner ── */}
      <div className="marquee-banner">
        <div className="marquee-track">
          {[1, 2].map((i) => (
            <div className="marquee-content" key={i} aria-hidden={i === 2}>
              <span className="marquee-item">✦ CRUELTY FREE</span>
              <span className="marquee-item">♡ LONG LASTING</span>
              <span className="marquee-item">✦ PREMIUM INGREDIENTS</span>
              <span className="marquee-item">❋ ALL NATURAL</span>
              <span className="marquee-item">✦ HANDCRAFTED</span>
              <span className="marquee-item">◆ SUSTAINABLY SOURCED</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Popular this week ── */}
      <section id="popular" className="sec sec-popular">
        <div className="sec-inner">
          <p className="sec-label">Our collection</p>
          <h2 className="sec-title">The Rooh Range</h2>

          <div className="pop-list">
            {[
              {
                name: 'Ashq',
                family: 'Woody Floral Musky',
                notes: 'Cardamom · Bergamot · Iris · Violet · Vetiver · White Musk',
                desc: 'Ashq is the scent of a feeling you cannot hide. Cool bergamot and cardamom sparkle at the top, melting into a tender heart of iris and violet. A soft base of vetiver and white musk leaves a gentle, emotional trail – like a single tear that says everything.',
                longevity: '7–9 hrs',
                shade: 'shade-ashq',
              },
              {
                name: 'Qalb',
                family: 'Amber Gourmand / Spicy Woody',
                notes: 'Dried Fig · Pink Pepper · Cinnamon · Rose Absolute · Sandalwood · Tonka Bean',
                desc: 'Warm, rich and deeply comforting. Juicy dried fig and a pinch of pink pepper open the story, flowing into cinnamon and rose absolute at the heart. Creamy sandalwood, tonka and soft musks rest on a whisper of oakmoss – a fragrance that feels like home.',
                longevity: '8–10 hrs',
                shade: 'shade-qalb',
              },
              {
                name: 'Sifr',
                family: 'Woody Musky / Minimal Leather',
                notes: 'Black Pepper · Incense · Leather · Violet · Musk · Vetiver · Cashmeran',
                desc: 'Minimalism with an edge. A crisp hit of black pepper and incense glows at the top, glossed with a modern leather accord and violet at the heart. Clean musk and dry vetiver create an abstract, skin-like aura that feels both present and elusive.',
                longevity: '7–9 hrs',
                shade: 'shade-sifr',
              },
              {
                name: 'Sahara Saffron',
                family: 'Amber Spicy Floral',
                notes: 'Saffron · Pink Pepper · Desert Rose · Chamomile · Amber Resin · Labdanum',
                desc: 'The heat of the dunes caught in a single breath. Fiery saffron and pink pepper shimmer at the top, settling into a heart of desert rose and calming chamomile. A molten base of amber resin and labdanum glows on the skin like the last light on the horizon.',
                longevity: '8–12 hrs',
                shade: 'shade-sahara',
              },
            ].map((item, i) => (
              <article key={item.name} className={`pop-card ${i % 2 !== 0 ? 'reverse' : ''}`}>
                <div className="pop-body">
                  <h3 className="pop-name">{item.name}</h3>
                  <span className="pop-family">{item.family}</span>
                  <p className="pop-notes">{item.notes}</p>
                  <p className="pop-desc">{item.desc}</p>
                  <span className="pop-longevity">⏱ {item.longevity}</span>
                  <a href="#shop" className="pop-buy">Discover</a>
                </div>
                <div className="pop-visual">
                  <div className={`pop-circle ${item.shade}`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop grid ── */}
      <section id="shop" className="sec sec-alt">
        <div className="sec-inner">
          <p className="sec-label">Browse</p>
          <h2 className="sec-title">Our collection</h2>

          <div className="grid-3">
            {[
              { name: 'Mademoiselle', price: '$111', shade: 'shade-rose' },
              { name: 'Coco Noire',   price: '$149', shade: 'shade-amber' },
              { name: 'Giorgio',      price: '$129', shade: 'shade-citrus' },
            ].map((p) => (
              <article key={p.name} className="prod-card">
                <div className={`prod-img ${p.shade}`} />
                <h4>{p.name}</h4>
                <span className="prod-price">{p.price}</span>
                <button className="btn-outline">Add to cart</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section id="testimonial" className="sec">
        <div className="sec-inner narrow">
          <p className="sec-label">What people say</p>
          <h2 className="sec-title">Testimonial</h2>

          <blockquote className="quote-card">
            <p>
              "Perfume is the art of memory. Every scent I wear connects me
              to a moment, a place, a feeling I never want to forget."
            </p>
            <footer>
              <div className="quote-avatar" />
              <div>
                <strong>Sarah Mitchell</strong>
                <span>Fragrance Curator</span>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="sec sec-alt">
        <div className="sec-inner narrow center-text">
          <h2 className="sec-title">Stay in the loop</h2>
          <p className="sec-sub">New arrivals, care tips, and limited releases — delivered monthly.</p>
          <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button className="btn-fill">Subscribe</button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="ft">
        <div className="ft-inner">
          <span className="ft-brand">Rooh Perfumes</span>
          <div className="ft-links">
            <a href="#popular">Popular</a>
            <a href="#shop">Shop</a>
            <a href="#testimonial">Reviews</a>
          </div>
          <span className="ft-copy">&copy; 2026 All rights reserved</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
