import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ShopPage.css'

const CollectionBodyMist = () => {
  return (
    <div className="shop-page">
      <Navbar />
      <header className="sp-hero">
        <div className="sp-hero-inner">
          <h1 className="sp-hero-title">Body Mist</h1>
          <p className="sp-hero-subtitle">Light & Refreshing — our selection of body mists</p>
        </div>
      </header>
      <main className="sp-main">
        {/* Blank content area for the Body Mist collection */}
      </main>
      <Footer />
    </div>
  )
}

export default CollectionBodyMist
