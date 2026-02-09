import '../styles/ShopByCategory.css'

const ShopByCategory = () => {
  const categories = [
    {
      id: 1,
      name: 'PERFUME',
      description: 'Timeless elegance in every spray',
      image: '/categories/perfume.jpg',
    },
    {
      id: 2,
      name: 'BAKHOOR',
      description: 'Traditional luxury fragrance',
      image: '/categories/bakhoor.jpg',
    },
    {
      id: 3,
      name: 'BODY MIST',
      description: 'Light and refreshing scents',
      image: '/categories/bodymist.jpg',
    },
  ]

  return (
    <section className="sec categories-sec">
      <div className="sec-inner">
        <div className="cat-header">
          <h2 className="cat-section-title">PRODUCT CATEGORIES</h2>
          <p className="cat-subtitle">To make things easier, we've gathered your favorites here.</p>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <a key={cat.id} href="#shop" className="cat-card">
              <div className="cat-image-wrapper">
                <img src={cat.image} alt={cat.name} className="cat-image" />
              </div>
              <div className="cat-content">
                <h3 className="cat-card-title">{cat.name}</h3>
                <p className="cat-card-desc">{cat.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategory
