import '../styles/MarqueeBanner.css'

type MarqueeBannerProps = {
  items?: string[]
}

const DEFAULT_ITEMS = [
  '✦ CRUELTY FREE',
  '♡ LONG LASTING',
  '✦ PREMIUM INGREDIENTS',
  '❋ ALL NATURAL',
  '✦ HANDCRAFTED',
  '◆ SUSTAINABLY SOURCED',
]

const MarqueeBanner = ({ items = DEFAULT_ITEMS }: MarqueeBannerProps) => {
  const renderItems = items.length < DEFAULT_ITEMS.length
    ? [...items, ...items]
    : items

  return (
    <div className="marquee-banner">
      <div className="marquee-track">
        {[1, 2].map((i) => (
          <div className="marquee-content" key={i} aria-hidden={i === 2}>
            {renderItems.map((item, index) => (
              <span className="marquee-item" key={`${i}-${index}-${item}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarqueeBanner
