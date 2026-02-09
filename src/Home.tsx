import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ShopByCategory from './components/ShopByCategory'
import MarqueeBanner from './components/MarqueeBanner'
import PopularSection from './components/PopularSection'
import ShopGrid from './components/ShopGrid'
import Testimonial from './components/Testimonial'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import { FloralDividerA, FloralDividerB } from './components/FloralAccents'
import './styles/Home.css'

const SectionDivider = () => (
  <div className="sec-divider">
    <div className="sec-divider-ornament">
      <span className="sec-divider-line" />
      <span className="sec-divider-diamond" />
      <span className="sec-divider-line" />
    </div>
  </div>
)

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <ShopByCategory />
      <FloralDividerA />
      <SectionDivider />
      <MarqueeBanner />
      <PopularSection />
      <FloralDividerB />
      <SectionDivider />
      <ShopGrid />
      <SectionDivider />
      <Testimonial />
      <SectionDivider />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
