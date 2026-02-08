import '../styles/ShopGrid.css'

const ShopGrid = () => {
  return (
    <section id="shop" className="sec sec-alt">
      <div className="sec-inner">
        <p className="sec-label">Browse</p>
        <h2 className="sec-title">Our collection</h2>

        <div className="grid-3">
          {[
            { name: 'Mademoiselle', price: '$111', shade: 'shade-rose' },
            { name: 'Coco Noire', price: '$149', shade: 'shade-amber' },
            { name: 'Giorgio', price: '$129', shade: 'shade-citrus' },
          ].map((p) => (
            <article key={p.name} className="prod-card">
              <div className={`prod-img ${p.shade}`} />
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
