import React, { Suspense, useRef, useEffect } from 'react'
import './Hero.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Model(props: any) {
  const gltf = useGLTF('/models/perfume-.glb') as any
  const scene = gltf.scene.clone()
  scene.rotation.set(0, 0, 0)
  const scale = props.scale ?? [1, 1, 1]
  const { ...rest } = props
  return <primitive object={scene} scale={scale} {...rest} />
}

useGLTF.preload('/models/perfume-.glb')

function ScrollRotateModel(props: any) {
  const groupRef = useRef<THREE.Group | null>(null)
  const velocityRef = useRef(0)
  const lastScrollRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    function onScroll() {
      const current = window.scrollY
      const delta = current - lastScrollRef.current
      lastScrollRef.current = current
      velocityRef.current += delta * 0.0008
      invalidate()
    }

    function onWheel(e: WheelEvent) {
      velocityRef.current += e.deltaY * 0.00012
      invalidate()
    }

    let lastTouchY = 0
    function onTouchStart(e: TouchEvent) {
      lastTouchY = e.touches[0]?.clientY ?? 0
    }

    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0]?.clientY ?? 0
      const delta = lastTouchY - y
      lastTouchY = y
      velocityRef.current += delta * 0.0009
      invalidate()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    if (Math.abs(velocityRef.current) < 1e-6) return
    g.rotation.y += velocityRef.current
    velocityRef.current *= 0.92
    const max = 0.06
    if (velocityRef.current > max) velocityRef.current = max
    if (velocityRef.current < -max) velocityRef.current = -max
    if (Math.abs(velocityRef.current) < 1e-6) velocityRef.current = 0
    invalidate()
  })

  return <group ref={groupRef} rotation={props.rotation}><Model {...props} /></group>
}

const Hero: React.FC = () => {
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
              <div className="bottle-canvas">
                <Canvas
                  shadows={false}
                  dpr={1}
                  frameloop="demand"
                  camera={{ position: [0, 0, 3.2], fov: 35 }}
                  gl={{ antialias: true, powerPreference: 'high-performance' }}
                  onCreated={(state) => {
                    // set renderer properties at runtime to avoid GLProps typing issues
                    try {
                      ;(state.gl as any).physicallyCorrectLights = true
                      ;(state.gl as any).toneMapping = (THREE as any).ACESFilmicToneMapping
                      ;(state.gl as any).outputEncoding = (THREE as any).sRGBEncoding
                    } catch (e) {
                      // ignore in environments where these props are not available
                    }
                  }}
                >
                  <ambientLight intensity={0.28} />
                  <hemisphereLight args={["#ffd7b5", "#3b2a1f", 0.45]} />
                  <directionalLight position={[4, 6, 6]} intensity={1.1} />
                  <spotLight position={[-3, 5, 4]} angle={0.4} penumbra={0.5} intensity={0.6} castShadow />
                  <pointLight position={[2, 1, 2]} intensity={0.5} />
                  <Suspense fallback={null}>
                    <Environment preset="sunset" background={false} resolution={256} />
                    <ScrollRotateModel scale={[0.8, 0.8, 0.8]} position={[0, -0.4, 0]} rotation={[0, Math.PI, 0]} />
                  </Suspense>
                </Canvas>
              </div>
            </div>

            <div className="reflection" aria-hidden>
              <div className="bottle-reflection-canvas">
                <Canvas
                  shadows={false}
                  dpr={1}
                  frameloop="demand"
                  camera={{ position: [0, 0, 3.2], fov: 35 }}
                  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  onCreated={(state) => {
                    try {
                      ;(state.gl as any).physicallyCorrectLights = true
                      ;(state.gl as any).toneMapping = (THREE as any).ACESFilmicToneMapping
                      ;(state.gl as any).outputEncoding = (THREE as any).sRGBEncoding
                    } catch (e) {}
                  }}
                >
                  <ambientLight intensity={0.22} />
                  <hemisphereLight args={["#ffd7b5", "#3b2a1f", 0.35]} />
                  <directionalLight position={[3, 5, 5]} intensity={0.8} />
                  <pointLight position={[2, 1, 2]} intensity={0.4} />
                  <Suspense fallback={null}>
                    <Environment preset="sunset" background={false} resolution={256} />
                    <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[1, 1, 1]}>
                      <ScrollRotateModel reflection scale={[1.2, 1.2, 1.2]} position={[0, 0.1, 0]} />
                    </group>
                  </Suspense>
                </Canvas>
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
