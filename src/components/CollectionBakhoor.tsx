import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ShopPage.css'

const CollectionBakhoor = () => {
  return (
    <div className="shop-page">
      <Navbar />
      <header className="sp-hero">
        <div className="sp-hero-inner">
          <h1 className="sp-hero-title">Bakhoor</h1>
          <p className="sp-hero-subtitle">Traditional Luxury — handcrafted bakhoor for your home</p>
        </div>
      </header>
      <main className="sp-main">
        {/* Blank content area for the Bakhoor collection */}
      </main>
      <Footer />
    </div>
  )
}

export default CollectionBakhoor
