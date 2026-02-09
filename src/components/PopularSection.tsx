import '../styles/PopularSection.css'

const PopularSection = () => {
  const products = [
    {
      name: 'Ashq',
      family: 'Woody Floral Musky',
      notes: 'Cardamom · Bergamot · Iris · Violet · Vetiver · White Musk',
      desc: 'Ashq is the scent of a feeling you cannot hide. Cool bergamot and cardamom sparkle at the top, melting into a tender heart of iris and violet. A soft base of vetiver and white musk leaves a gentle, emotional trail – like a single tear that says everything.',
      longevity: '7–9 hrs',
      shade: 'shade-ashq',
      image: '/perfumes/ashq.png',
    },
    {
      name: 'Qalb',
      family: 'Amber Gourmand / Spicy Woody',
      notes: 'Dried Fig · Pink Pepper · Cinnamon · Rose Absolute · Sandalwood · Tonka Bean',
      desc: 'Warm, rich and deeply comforting. Juicy dried fig and a pinch of pink pepper open the story, flowing into cinnamon and rose absolute at the heart. Creamy sandalwood, tonka and soft musks rest on a whisper of oakmoss – a fragrance that feels like home.',
      longevity: '8–10 hrs',
      shade: 'shade-qalb',
      image: '/perfumes/qalb.png',
    },
    {
      name: 'Sifr',
      family: 'Woody Musky / Minimal Leather',
      notes: 'Black Pepper · Incense · Leather · Violet · Musk · Vetiver · Cashmeran',
      desc: 'Minimalism with an edge. A crisp hit of black pepper and incense glows at the top, glossed with a modern leather accord and violet at the heart. Clean musk and dry vetiver create an abstract, skin-like aura that feels both present and elusive.',
      longevity: '7–9 hrs',
      shade: 'shade-sifr',
      image: '/perfumes/sifr.png',
    },
    {
      name: 'Sahara Saffron',
      family: 'Amber Spicy Floral',
      notes: 'Saffron · Pink Pepper · Desert Rose · Chamomile · Amber Resin · Labdanum',
      desc: 'The heat of the dunes caught in a single breath. Fiery saffron and pink pepper shimmer at the top, settling into a heart of desert rose and calming chamomile. A molten base of amber resin and labdanum glows on the skin like the last light on the horizon.',
      longevity: '8–12 hrs',
      shade: 'shade-sahara',
      image: '/perfumes/sahara-saffron.png',
    },
  ]

  return (
    <section id="popular" className="sec sec-popular">
      <div className="sec-inner">
        <p className="sec-label">Our collection</p>
        <h2 className="sec-title">The Rooh Range</h2>

        <div className="pop-list">
          {products.map((item, i) => (
            <article key={item.name} className={`pop-card ${i % 2 !== 0 ? 'reverse' : ''}`}>
              <div className="pop-body">
                <h3 className="pop-name">{item.name}</h3>
                <span className="pop-family">{item.family}</span>
                <p className="pop-notes">{item.notes}</p>
                <p className="pop-desc">{item.desc}</p>
                <span className="pop-longevity">⏱ {item.longevity}</span>
                <a href="#shop" className="pop-buy">
                  Discover
                </a>
              </div>
              <div className="pop-visual">
                <div className={`pop-circle ${item.shade}`}>
                  <img src={item.image} alt={item.name} className="pop-image" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularSection
