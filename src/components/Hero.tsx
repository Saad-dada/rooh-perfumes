import { useEffect, useRef, useState } from 'react'
import '../styles/Hero.css'

type HeroSlide = {
  name: string
  label: string
  tagline: string
  description: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    name: 'Ashq',
    label: 'Eau de Parfum',
    tagline: 'Romantic warmth in every note',
    description:
      'Ashq blends floral sweetness with soft amber for a graceful, lingering signature made for everyday elegance.',
  },
  {
    name: 'Qalb',
    label: 'Eau de Parfum',
    tagline: 'A soulful oriental expression',
    description:
      'Qalb unfolds with rich woods and musky depth, crafted for those who love bold character and lasting presence.',
  },
  {
    name: 'Sifr',
    label: 'Eau de Parfum',
    tagline: 'Clean, modern, and magnetic',
    description:
      'Sifr opens crisp and fresh, then settles into smooth warmth that feels minimal, refined, and unforgettable.',
  },
  {
    name: 'Sahara Saffron',
    label: 'Eau de Parfum',
    tagline: 'Golden spice with desert luxury',
    description:
      'Sahara Saffron pairs luminous saffron accents with deep resinous undertones for an opulent evening aura.',
  },
]

const AUTO_SLIDE_MS = 10000
const TOTAL_FRAMES = 48
const PIXELS_PER_FRAME = 24

const padFrame = (index: number) => String(index).padStart(3, '0')
const frameSrc = (frameIndex: number) => `/frames/qalb/frame_${padFrame(frameIndex + 1)}.png`

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [frame, setFrame] = useState(0)
  const [isSequenceReady, setIsSequenceReady] = useState(false)
  const [isSlideChanging, setIsSlideChanging] = useState(false)

  const latestOffset = useRef(0)
  const accumulatedOffset = useRef(0)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const rafId = useRef<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reflectionCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const drawnFrameRef = useRef<number>(-1)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, AUTO_SLIDE_MS)

    return () => window.clearTimeout(timer)
  }, [activeSlide])

  useEffect(() => {
    setIsSlideChanging(true)
    const fadeTimer = window.setTimeout(() => {
      setIsSlideChanging(false)
    }, 1100)

    return () => window.clearTimeout(fadeTimer)
  }, [activeSlide])

  useEffect(() => {
    let cancelled = false

    const preloadAllFrames = async () => {
      const tasks = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
        const img = new Image()
        img.src = frameSrc(index)

        return new Promise<HTMLImageElement>((resolve) => {
          const done = () => resolve(img)

          if (img.decode) {
            void img.decode().then(done).catch(done)
          } else {
            img.onload = done
            img.onerror = done
          }
        })
      })

      const loadedFrames = await Promise.all(tasks)
      if (!cancelled) {
        framesRef.current = loadedFrames
        setIsSequenceReady(true)
      }
    }

    void preloadAllFrames()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isSequenceReady) return

    const canvas = canvasRef.current
    const reflectionCanvas = reflectionCanvasRef.current
    const frameImage = framesRef.current[frame]

    if (!canvas || !reflectionCanvas || !frameImage || drawnFrameRef.current === frame) {
      return
    }

    const ctx = canvas.getContext('2d')
    const reflectionCtx = reflectionCanvas.getContext('2d')
    if (!ctx || !reflectionCtx) return

    const width = frameImage.naturalWidth || frameImage.width
    const height = frameImage.naturalHeight || frameImage.height

    if (width > 0 && height > 0) {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      if (reflectionCanvas.width !== width || reflectionCanvas.height !== height) {
        reflectionCanvas.width = width
        reflectionCanvas.height = height
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height)

      reflectionCtx.clearRect(0, 0, reflectionCanvas.width, reflectionCanvas.height)
      reflectionCtx.drawImage(frameImage, 0, 0, reflectionCanvas.width, reflectionCanvas.height)

      drawnFrameRef.current = frame
    }
  }, [frame, isSequenceReady, activeSlide])

  useEffect(() => {
    const updateFrame = (offset: number) => {
      const rawIndex = Math.floor(offset / PIXELS_PER_FRAME)
      const nextFrame = ((rawIndex % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES
      setFrame((prevFrame) => (prevFrame === nextFrame ? prevFrame : nextFrame))
      ticking.current = false
    }

    const scheduleUpdate = () => {
      if (!ticking.current) {
        ticking.current = true
        rafId.current = window.requestAnimationFrame(() => updateFrame(latestOffset.current))
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const deltaY = currentScrollY - lastScrollY.current
      lastScrollY.current = currentScrollY

      if (deltaY !== 0) {
        accumulatedOffset.current += deltaY
        latestOffset.current = accumulatedOffset.current
        scheduleUpdate()
      }
    }

    const handleWheel = (event: WheelEvent) => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const atTop = window.scrollY <= 0
      const atBottom = window.scrollY >= Math.max(0, maxScroll)

      if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0)) {
        accumulatedOffset.current += event.deltaY
        latestOffset.current = accumulatedOffset.current
        scheduleUpdate()
      }
    }

    accumulatedOffset.current = window.scrollY
    latestOffset.current = accumulatedOffset.current
    lastScrollY.current = window.scrollY
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  const current = HERO_SLIDES[activeSlide]
  const fadeClass = isSlideChanging ? 'slide-fade-active' : ''
  const goPrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }
  const goNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  return (
    <section className="hero featured" aria-labelledby="hero-heading">
      <div className="hero-inner featured-grid">
        <div className={`side left hero-slide-panel ${fadeClass}`}>
          <p className="hero-label">{current.label}</p>
          <h1 className="hero-brand" id="hero-heading">{current.name}</h1>
          <p className="hero-tagline">{current.tagline}</p>
          <p className="hero-desc">{current.description}</p>
          <a href="#shop" className="hero-cta">
            Explore Collection
            <span className="hero-cta-arrow">→</span>
          </a>
        </div>

        <div className={`center hero-slide-panel ${fadeClass}`} role="img" aria-label={`${current.name} spotlight`}>
          <div className="bottle-wrap">
            <svg width="0" height="0" style={{ position: 'absolute' }}>
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
                    Rooh Perfumes · {current.tagline} · {' '}
                  </textPath>
                </text>
              </svg>
            </div>

            <div className="bottle">
              <canvas
                ref={canvasRef}
                aria-label={`${current.name} 360 view`}
                className="bottle-img scroll360-image hero-slide-image"
                style={{ visibility: isSequenceReady ? 'visible' : 'hidden' }}
              />
            </div>

            <div className="reflection" aria-hidden>
              <div className="bottle-reflection-mirror">
                <canvas
                  ref={reflectionCanvasRef}
                  className="bottle-img scroll360-image hero-slide-image"
                  style={{ visibility: isSequenceReady ? 'visible' : 'hidden' }}
                />
              </div>
            </div>
          </div>

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

        <div className="hero-slide-controls" aria-label="Hero slide controls">
          <button
            type="button"
            className="hero-slide-arrow"
            onClick={goPrevSlide}
            aria-label="Previous perfume"
          >
            ←
          </button>

          <div className="hero-slide-dots" aria-label="Hero perfume slides">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.name}
                type="button"
                className={`hero-slide-dot ${index === activeSlide ? 'is-active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${slide.name}`}
                aria-pressed={index === activeSlide}
              />
            ))}
          </div>

          <button
            type="button"
            className="hero-slide-arrow"
            onClick={goNextSlide}
            aria-label="Next perfume"
          >
            →
          </button>
        </div>

        <div className="side right">
          <span className="hero-right-text">{current.name} — 2026 Collection</span>
        </div>
      </div>
    </section>
  )
}

export default Hero