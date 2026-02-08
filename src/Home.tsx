import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ShopByCategory from './components/ShopByCategory'
import MarqueeBanner from './components/MarqueeBanner'
import PopularSection from './components/PopularSection'
import ShopGrid from './components/ShopGrid'
import Testimonial from './components/Testimonial'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import './styles/Home.css'

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <ShopByCategory />
      <MarqueeBanner />
      <PopularSection />
      <ShopGrid />
      <Testimonial />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
