import '../styles/ShopByCategory.css'

const ShopByCategory = () => {
  return (
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
  )
}

export default ShopByCategory
