import React, { useEffect, useState } from "react";
import "../styles/Hero.css";
const totalFrames = 6;
const SCROLL_PIXELS_PER_FRAME = 120;

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

const Hero: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    for (let i = 1; i <= totalFrames; i += 1) {
      const img = new Image();
      img.src = `/frames/${i}.png`;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const steppedFrame = Math.floor(scrollTop / SCROLL_PIXELS_PER_FRAME);
      const frameIndex = ((steppedFrame % totalFrames) + totalFrames) % totalFrames;

      setFrame(frameIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero featured" aria-labelledby="hero-heading">
      <div className="hero-inner featured-grid">
        <div className="side left">
          <p className="hero-label">Eau de Parfum</p>
          <h1 className="hero-brand" id="hero-heading">Rooh</h1>
          <p className="hero-tagline">Fragrance that touches the soul</p>
          <p className="hero-desc">
            Handcrafted oriental perfumes inspired by heritage, 
            designed for those who seek depth in every note.
          </p>
          <a href="#shop" className="hero-cta">
            Explore Collection
            <span className="hero-cta-arrow">→</span>
          </a>
        </div>

        <div className="center" role="img" aria-label="Perfume spotlight">
          <div className="bottle-wrap">
            {/* SVG filter for animated water ripple effect */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <filter id="water-ripple">
                <feTurbulence
                  id="turbwave"
                  type="turbulence"
                  baseFrequency="0.015 0.09"
                  numOctaves="2"
                  seed="3"
                  result="turb"
                />
                <feDisplacementMap
                  in2="turb"
                  in="SourceGraphic"
                  scale="18"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                <animate
                  xlinkHref="#turbwave"
                  attributeName="seed"
                  from="3"
                  to="33"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </filter>
            </svg>

            <div className="circle-text" aria-hidden>
              <svg
                viewBox="0 0 500 500"
                className="circle-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <path id="circlePath" d="M250,60 a190,190 0 1,1 -0.1,0" />
                  <radialGradient id="textGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#72325b" />
                    <stop offset="100%" stopColor="#4D193A" />
                  </radialGradient>
                </defs>
                <text className="circ-text">
                  <textPath href="#circlePath" startOffset="0">
                    Rooh Perfumes · Fragrance that touches the soul ·{" "}
                  </textPath>
                </text>
              </svg>
            </div>

            <div className="bottle">
              <div className="bottle-canvas scroll360-stage">
                <img
                  src={`/frames/${frame + 1}.png`}
                  alt="360 view"
                  className="scroll360-image"
                />
              </div>
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
              position: "absolute",
              left: "-1vw",
              bottom: 0,
              width: "102vw",
              height: "38vh",
              zIndex: 0,
              pointerEvents: "none",
              display: "block",
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
              <linearGradient
                id="water-gradient"
                x1="0"
                y1="380"
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#9699B3" />
                <stop offset="40%" stopColor="#b3b5c9" />
                <stop offset="70%" stopColor="#e0e1ea" />
                <stop offset="100%" stopColor="#9699B3" stopOpacity="0.04" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="side right">
          <span className="hero-right-text">Eau de Parfum — 2026 Collection</span>

          <div className="hero-scroll-hint">
            <div className="hero-scroll-circle">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M7 1v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="hero-scroll-text">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
