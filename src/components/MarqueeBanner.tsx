import '../styles/MarqueeBanner.css'

const MarqueeBanner = () => {
  return (
    <div className="marquee-banner">
      <div className="marquee-track">
        {[1, 2].map((i) => (
          <div className="marquee-content" key={i} aria-hidden={i === 2}>
            <span className="marquee-item">✦ CRUELTY FREE</span>
            <span className="marquee-item">♡ LONG LASTING</span>
            <span className="marquee-item">✦ PREMIUM INGREDIENTS</span>
            <span className="marquee-item">❋ ALL NATURAL</span>
            <span className="marquee-item">✦ HANDCRAFTED</span>
            <span className="marquee-item">◆ SUSTAINABLY SOURCED</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarqueeBanner
