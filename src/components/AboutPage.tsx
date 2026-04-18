import Navbar from './Navbar'
import Footer from './Footer'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import '../styles/AboutPage.css'

const features = [
  {
    title: 'Natural Ingredients',
    text: 'Curated oils, resins, and aroma compounds selected for purity, depth, and smooth burn.', 
  },
  {
    title: 'Thoughtful Craft',
    text: 'Each blend is balanced to open beautifully, evolve gracefully, and linger with elegance.',
  },
  {
    title: 'Lasting Quality',
    text: 'Premium composition designed for long wear in homes, gatherings, and everyday moments.',
  },
]

const stats = [
  { label: 'Blends Curated', value: '25+' },
  { label: 'Natural Focus', value: '100%' },
  { label: 'Customer Reach', value: 'UAE + GCC' },
]

const AboutPage = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.about-reveal'))
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-page">
      <Navbar />

      <section className="about-hero">
        <video className="about-hero-video" src="/rooh-about.mp4" autoPlay muted loop playsInline />
        <div className="about-hero-overlay" />
        <div className="about-hero-content about-reveal">
          <span className="about-hero-kicker">Rooh Perfumes</span>
          <h1>About Us</h1>
          <p>Fragrance that touches your soul</p>
          <img src="/roohlogo.png" alt="Rooh Perfumes" className="about-hero-logo" loading="lazy" />
        </div>
      </section>

      <main className="about-main">
        <section className="about-stats about-reveal" aria-label="Rooh highlights">
          {stats.map((item) => (
            <article key={item.label} className="about-stat-card">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </article>
          ))}
        </section>

        <section className="about-intro about-reveal">
          <h2>Built on tradition, shaped for modern luxury</h2>
          <p>
            Rooh Perfumes is a fragrance brand owned by RB Trading – F.Z.E, registered in Ajman Free Zone,
            United Arab Emirates.
          </p>
          <p>
            We focus on creating and offering premium perfumes directly through our official website, blending
            timeless oriental richness with contemporary refinement. Every bottle is designed to deliver warmth,
            character, and a memorable scent trail.
          </p>
        </section>

        <section className="about-story about-reveal" aria-label="Rooh story section">
          <div className="about-story-content">
            <h3>Our Story</h3>
            <p>
              Rooh was born from a simple idea: fragrance should feel personal, soulful, and unmistakably elegant.
              Inspired by traditional perfumery and crafted for modern lifestyles, our collection celebrates depth,
              clarity, and comfort in every note.
            </p>
            <p>
              From first impression to dry down, we design blends that stay present without overpowering — ideal for
              daily wear and meaningful occasions alike.
            </p>
          </div>
          <div className="about-story-media" aria-hidden>
            <p>
              “Every fragrance tells a story — ours are crafted to feel warm, elegant, and unforgettable.”
            </p>
          </div>
        </section>

        <section className="about-signature about-reveal" aria-label="Rooh signature section">
          <h3>The Rooh Signature</h3>
          <p>
            We combine timeless oriental warmth with modern refinement, creating scents that are expressive,
            wearable, and deeply memorable.
          </p>
        </section>

        <section className="about-features about-reveal" aria-label="Rooh values">
          {features.map((feature) => (
            <article key={feature.title} className="about-feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </section>

        <section className="about-cta about-reveal" aria-label="About page call to action">
          <img src="/roohlogo.png" alt="Rooh Perfumes" className="about-cta-logo" loading="lazy" />
          <h3>Discover your signature scent</h3>
          <p>Explore our collection and find the fragrance that matches your mood, moment, and style.</p>
          <div className="about-cta-actions">
            <Link to="/shop">Explore Collection</Link>
            <Link to="/contact" className="about-cta-secondary">Contact Us</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage