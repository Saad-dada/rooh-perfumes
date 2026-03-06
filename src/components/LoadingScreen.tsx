import { useEffect, useRef, useState } from 'react'
import '../styles/LoadingScreen.css'
import { preloadHeroFrames } from '../lib/heroFrames'

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const assetsReadyRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const preloadAssets = async () => {
      await preloadHeroFrames()
      if (!cancelled) {
        assetsReadyRef.current = true
      }
    }

    void preloadAssets()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }

        if (!assetsReadyRef.current && prev >= 94) {
          return 94
        }

        const increment = prev < 60 ? 3 : prev < 85 ? 2 : 1
        const maxProgress = assetsReadyRef.current ? 100 : 94
        return Math.min(prev + increment, maxProgress)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      // Wait a moment then fade out
      const timeout = setTimeout(() => setFadeOut(true), 400)
      return () => clearTimeout(timeout)
    }
  }, [progress])

  useEffect(() => {
    if (fadeOut) {
      const timeout = setTimeout(onFinished, 800)
      return () => clearTimeout(timeout)
    }
  }, [fadeOut, onFinished])

  return (
    <div className={`loading-screen ${fadeOut ? 'loading-screen--fade' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo-wrapper">
          <img src="/roohlogo.png" alt="Rooh Perfumes" className="loading-logo" />
        </div>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-tagline">Fragrance that touches the soul</p>
      </div>
    </div>
  )
}

export default LoadingScreen
