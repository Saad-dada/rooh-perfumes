import '../styles/ShopGrid.css'

const ShopGrid = () => {
  const products = [
    { name: 'Ashq', price: '$111', shade: 'shade-ashq', image: '/perfumes/ashq.png' },
    { name: 'Qalb', price: '$149', shade: 'shade-qalb', image: '/perfumes/qalb.png' },
    { name: 'Sifr', price: '$129', shade: 'shade-sifr', image: '/perfumes/sifr.png' },
    { name: 'Sahara Saffron', price: '$139', shade: 'shade-sahara', image: '/perfumes/sahara-saffron.png' },
  ]

  return (
    <section id="shop" className="sec sec-shop">
      <div className="shop-inner">
        <h2 className="shop-title">Our shop</h2>

        <div className="shop-grid">
          {products.map((p) => (
            <article key={p.name} className="shop-card">
              <div className={`shop-card-arch ${p.shade}`}>
                <img src={p.image} alt={p.name} className="shop-card-img" />
              </div>
              <div className="shop-card-info">
                <h4 className="shop-card-name">{p.name}</h4>
                <span className="shop-card-price">{p.price}</span>
              </div>
              <button className="shop-card-btn">Add to cart</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid
