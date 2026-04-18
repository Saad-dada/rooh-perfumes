import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ShopByCategory from './components/ShopByCategory'
import './styles/Home.css'

const MarqueeBanner = lazy(() => import('./components/MarqueeBanner'))
const ShopGrid = lazy(() => import('./components/ShopGrid'))
const Testimonial = lazy(() => import('./components/Testimonial'))
const Newsletter = lazy(() => import('./components/Newsletter'))
const Footer = lazy(() => import('./components/Footer'))

const SectionDivider = () => (
  <div className="sec-divider">
    <div className="sec-divider-ornament">
      <span className="sec-divider-line" />
      <span className="sec-divider-diamond" />
      <span className="sec-divider-line" />
    </div>
  </div>
)

const DeferredSection = ({ children }: { children: React.ReactNode }) => {
  const [shouldRender, setShouldRender] = useState(false)
  const markerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin: '500px 0px' },
    )

    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={markerRef}>
      {shouldRender ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  )
}

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <ShopByCategory />
      <DeferredSection>
        <SectionDivider />
        <MarqueeBanner />
      </DeferredSection>
      <DeferredSection>
        <SectionDivider />
        <ShopGrid />
      </DeferredSection>
      <DeferredSection>
        <SectionDivider />
        <Testimonial />
      </DeferredSection>
      <DeferredSection>
        <SectionDivider />
        <Newsletter />
      </DeferredSection>
      <DeferredSection>
        <Footer />
      </DeferredSection>
    </div>
  )
}

export default Home
