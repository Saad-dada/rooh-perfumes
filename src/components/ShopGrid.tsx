import '../styles/ShopGrid.css'

const ShopGrid = () => {
  return (
    <section id="shop" className="sec sec-alt sec-shop">
      <div className="sec-inner">
        <p className="sec-label">Browse</p>
        <h2 className="sec-title">Our collection</h2>

        <div className="grid-3">
          {[
            { name: 'Ashq', price: '$111', shade: 'shade-ashq', image: '/perfumes/ashq.png' },
            { name: 'Qalb', price: '$149', shade: 'shade-qalb', image: '/perfumes/qalb.png' },
            { name: 'Sifr', price: '$129', shade: 'shade-sifr', image: '/perfumes/sifr.png' },
            { name: 'Sahara Saffron', price: '$139', shade: 'shade-sahara', image: '/perfumes/sahara-saffron.png' },
          ].map((p) => (
            <article key={p.name} className="prod-card">
              <div className={`prod-img ${p.shade}`}>
                <img src={p.image} alt={p.name} className="prod-img-photo" />
              </div>
              <h4>{p.name}</h4>
              <span className="prod-price">{p.price}</span>
              <button className="btn-outline">Add to cart</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopGrid
