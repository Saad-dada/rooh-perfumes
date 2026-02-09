import '../styles/PopularSection.css'

const PopularSection = () => {
  const products = [
    {
      name: 'Ashq',
      desc: 'Cool bergamot and cardamom sparkle at the top, melting into a tender heart of iris and violet. A soft base of vetiver and white musk.',
      price: '$111',
      shade: 'shade-ashq',
      image: '/perfumes/ashq.png',
    },
    {
      name: 'Qalb',
      desc: 'Juicy dried fig and pink pepper open the story, flowing into cinnamon and rose absolute at the heart. Creamy sandalwood and tonka.',
      price: '$149',
      shade: 'shade-qalb',
      image: '/perfumes/qalb.png',
    },
    {
      name: 'Sifr',
      desc: 'A crisp hit of black pepper and incense glows at the top, glossed with a modern leather accord and violet. Clean musk and dry vetiver.',
      price: '$129',
      shade: 'shade-sifr',
      image: '/perfumes/sifr.png',
    },
    {
      name: 'Sahara Saffron',
      desc: 'Fiery saffron and pink pepper shimmer at the top, settling into a heart of desert rose and calming chamomile. Amber resin and labdanum.',
      price: '$139',
      shade: 'shade-sahara',
      image: '/perfumes/sahara-saffron.png',
    },
  ]

  return (
    <section id="popular" className="sec sec-popular">
      <div className="pop-header">
        <p className="pop-label">Our collection</p>
        <h2 className="pop-heading">The Rooh Range</h2>
      </div>

      <div className="pop-list">
        {products.map((item, i) => (
          <article key={item.name} className={`pop-card ${i % 2 !== 0 ? 'reverse' : ''}`}>
            <div className="pop-body">
              <h3 className="pop-name">{item.name}</h3>
              <p className="pop-desc">{item.desc}</p>
              <span className="pop-price">{item.price}</span>
              <a href="#shop" className="pop-buy">Buy now</a>
            </div>
            <div className="pop-visual">
              <div className={`pop-circle ${item.shade}`}>
                <img src={item.image} alt={item.name} className="pop-image" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PopularSection
