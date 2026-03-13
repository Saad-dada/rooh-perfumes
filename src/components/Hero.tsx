import { useEffect, useRef, useState } from 'react'
import '../styles/Hero.css'
import {
  getHeroFramesCache,
  getMobileFramesCache,
  preloadHeroFolder,
  preloadHeroFolderMobile,
  preloadHeroFrames,
  preloadHeroFramesMobile,
  MOBILE_TOTAL_FRAMES,
} from '../lib/heroFrames'

// True on touch/mobile devices — evaluated once at module load
const isMobileDevice =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

type HeroSlide = {
  name: string
  label: string
  tagline: string
  description: string
  frameFolder: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    name: 'Ashq',
    label: 'Eau de Parfum',
    tagline: 'Romantic warmth in every note',
    description:
      'Ashq blends floral sweetness with soft amber for a graceful, lingering signature made for everyday elegance.',
    frameFolder: 'ashq',
  },
  {
    name: 'Qalb',
    label: 'Eau de Parfum',
    tagline: 'A soulful oriental expression',
    description:
      'Qalb unfolds with rich woods and musky depth, crafted for those who love bold character and lasting presence.',
    frameFolder: 'qalb',
  },
  {
    name: 'Sifr',
    label: 'Eau de Parfum',
    tagline: 'Clean, modern, and magnetic',
    description:
      'Sifr opens crisp and fresh, then settles into smooth warmth that feels minimal, refined, and unforgettable.',
    frameFolder: 'sifr',
  },
]

const AUTO_SLIDE_MS = 6000
const AUTO_ROTATE_FRAME_MS = 140

const initialFramesCache = isMobileDevice ? getMobileFramesCache() : getHeroFramesCache()
const ACTIVE_TOTAL_FRAMES = isMobileDevice ? MOBILE_TOTAL_FRAMES : MOBILE_TOTAL_FRAMES * 4 // full 48 on desktop

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [frame, setFrame] = useState(0)
  const [isSequenceReady, setIsSequenceReady] = useState(Boolean(initialFramesCache))
  const [isSlideChanging, setIsSlideChanging] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reflectionCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const framesRef = useRef<Record<string, HTMLImageElement[]>>(initialFramesCache ?? {})
  const drawnFrameKeyRef = useRef<string>('')
  // First-frame static placeholder src — shown while canvas loads
  const placeholderSrc = `/frames/${HERO_SLIDES[0].frameFolder}/frame_001.webp`

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

    const loadFrames = async () => {
      const firstFolder = HERO_SLIDES[0].frameFolder

      if (isMobileDevice) {
        // Mobile: load only 12 frames per folder (~75% less data)
        const firstFrames = await preloadHeroFolderMobile(firstFolder)
        if (!cancelled) {
          framesRef.current = { ...framesRef.current, [firstFolder]: firstFrames }
          setIsSequenceReady(true)
        }
        const all = await preloadHeroFramesMobile()
        if (!cancelled) framesRef.current = all
      } else {
        // Desktop: load full 48 frames, first folder first
        const firstFrames = await preloadHeroFolder(firstFolder)
        if (!cancelled) {
          framesRef.current = { ...framesRef.current, [firstFolder]: firstFrames }
          setIsSequenceReady(true)
        }
        const all = await preloadHeroFrames()
        if (!cancelled) framesRef.current = all
      }
    }

    void loadFrames()

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isSequenceReady) return

    const currentSlide = HERO_SLIDES[activeSlide]
    const currentFrames = framesRef.current[currentSlide.frameFolder] ?? []
    const canvas = canvasRef.current
    const reflectionCanvas = reflectionCanvasRef.current
    const frameImage = currentFrames[frame]
    const frameKey = `${currentSlide.frameFolder}-${frame}`

    if (!canvas || !reflectionCanvas || !frameImage || drawnFrameKeyRef.current === frameKey) {
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

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      reflectionCtx.imageSmoothingEnabled = true
      reflectionCtx.imageSmoothingQuality = 'high'

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height)

      reflectionCtx.clearRect(0, 0, reflectionCanvas.width, reflectionCanvas.height)
      reflectionCtx.drawImage(frameImage, 0, 0, reflectionCanvas.width, reflectionCanvas.height)

      drawnFrameKeyRef.current = frameKey
    }
  }, [frame, isSequenceReady, activeSlide])

  useEffect(() => {
    const currentSlide = HERO_SLIDES[activeSlide]
    const totalFrames = framesRef.current[currentSlide.frameFolder]?.length ?? ACTIVE_TOTAL_FRAMES

    if (!totalFrames || totalFrames <= 1) return

    setFrame((prev) => prev % totalFrames)

    let rafId: number | null = null
    let lastTime = 0
    let elapsed = 0

    const tick = (time: number) => {
      if (lastTime === 0) {
        lastTime = time
      }

      elapsed += time - lastTime
      lastTime = time

      if (elapsed >= AUTO_ROTATE_FRAME_MS) {
        const frameSteps = Math.floor(elapsed / AUTO_ROTATE_FRAME_MS)
        elapsed %= AUTO_ROTATE_FRAME_MS
        setFrame((prev) => (prev + frameSteps) % totalFrames)
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [activeSlide, isSequenceReady])

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
              {/* Static placeholder — shown instantly while canvas frames are loading */}
              {!isSequenceReady && (
                <img
                  src={placeholderSrc}
                  alt={current.name}
                  className="bottle-img hero-slide-image"
                  fetchPriority="high"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
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