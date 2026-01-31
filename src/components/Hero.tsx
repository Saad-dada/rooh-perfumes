import React from 'react'
import './Hero.css'

const Hero: React.FC = () => {
  const img = "/perfume.png"

  return (
    <section className="hero featured" aria-labelledby="hero-heading">
      <div className="hero-inner featured-grid">
        <div className="side left">
          <h2 className="product-title">FLORENCE BY<br /><span>ROBERTO CAVALLI</span></h2>
          <p className="product-lead">A captivating fragrance inspired by the enchanting beauty of Tuscany. In this radiant landscape, rare are the flowers that bloom with such elegance.</p>
        </div>

        <div className="center" role="img" aria-label="Perfume spotlight">
          <div className="bottle-wrap">
            {/* SVG filter for animated water ripple effect */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <filter id="water-ripple">
                <feTurbulence id="turbwave" type="turbulence" baseFrequency="0.015 0.09" numOctaves="2" seed="3" result="turb"/>
                <feDisplacementMap in2="turb" in="SourceGraphic" scale="18" xChannelSelector="R" yChannelSelector="G"/>
                <animate xlinkHref="#turbwave" attributeName="seed" from="3" to="33" dur="8s" repeatCount="indefinite" />
              </filter>
            </svg>

            <div className="circle-text" aria-hidden>
              <svg viewBox="0 0 500 500" className="circle-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <path id="circlePath" d="M250,60 a190,190 0 1,1 -0.1,0" />
                </defs>
                <text className="circ-text">
                  <textPath href="#circlePath" startOffset="0">Enchanting and Elegant · Roberto Cavalli · </textPath>
                </text>
              </svg>
            </div>

            <div className="bottle">
              <img src={img} alt="Perfume bottle" className="bottle-img" />
            </div>

            <div className="reflection" aria-hidden>
              <img
                src={img}
                alt=""
                className="bottle-reflection"
                style={{
                  filter: 'blur(2.5px) saturate(0.85) contrast(1.1) url(#water-ripple)'
                }}
              />
            </div>
          </div>
          {/* Animated SVG water layer with ripple filter */}
          <svg
            className="water-svg"
            width="100%"
            height="38vh"
            viewBox="0 0 1000 380"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              left: '-1vw',
              bottom: 0,
              width: '102vw',
              height: '38vh',
              zIndex: 0,
              pointerEvents: 'none',
              display: 'block',
            }}
            aria-hidden
          >
            <rect
              x="0"
              y="0"
              width="1000"
              height="380"
              fill="url(#water-gradient)"
              filter="url(#water-ripple)"
              opacity="0.82"
            />
            <defs>
              <linearGradient id="water-gradient" x1="0" y1="380" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#9699B3" />
                <stop offset="40%" stopColor="#b3b5c9" />
                <stop offset="70%" stopColor="#e0e1ea" />
                <stop offset="100%" stopColor="#9699B3" stopOpacity="0.04" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="side right">
          <div className="price-large">$369</div>
          <button className="btn add" aria-label="Add to cart">ADD TO CART</button>
        </div>
      </div>

      <div className="info-bottom">
        <div className="text-left">Top notes of juicy black currant and fresh mandarin create a bright, enticing opening. The heart reveals a bouquet of orange blossom.</div>
        <div className="text-right">Base notes of patchouli and musk provide a warm, sensual finish, leaving the alluring essence of Florence to linger on the skin.</div>
      </div>
    </section>
  )
}

export default Hero
