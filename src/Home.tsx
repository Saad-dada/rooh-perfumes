import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ShopByCategory from './components/ShopByCategory'
import MarqueeBanner from './components/MarqueeBanner'
import ShopGrid from './components/ShopGrid'
import Testimonial from './components/Testimonial'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
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
      <MarqueeBanner
        items={[
          ' SPECIAL LAUNCH OFFER',
          ' BUY 2 FOR AED 150',
          ' COUPON CODE: LAUNCHOFFER',
          ' LIMITED TIME ONLY ♡',
        ]}
      />
      <ShopByCategory />
      <SectionDivider />
      <MarqueeBanner />
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
