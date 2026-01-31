import React, { Suspense } from 'react'
import './Hero.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Model(props: any) {
  const gltf = useGLTF('/models/perfume_bottle.glb') as any
  const scene = gltf.scene.clone()

  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true

      const srcMat = child.material
      try {
        const params: any = {}
        if (srcMat) {
          if (srcMat.map) params.map = srcMat.map
          if (srcMat.color) params.color = srcMat.color
          if (srcMat.normalMap) params.normalMap = srcMat.normalMap
          if (srcMat.roughnessMap) params.roughnessMap = srcMat.roughnessMap
        }

        const isReflection = !!props.reflection
        const glass = new THREE.MeshPhysicalMaterial({
          ...params,
          transparent: true,
          opacity: isReflection ? 0.72 : 1,
          transmission: isReflection ? 0.75 : 0.96,
          thickness: isReflection ? 0.12 : 0.24,
          ior: 1.45,
          roughness: isReflection ? 0.22 : 0.12,
          metalness: 0,
          clearcoat: isReflection ? 0.04 : 0.08,
          clearcoatRoughness: isReflection ? 0.08 : 0.03,
          envMapIntensity: isReflection ? 1.2 : 1.0,
          side: THREE.DoubleSide,
        })

        glass.name = srcMat?.name ?? 'glass'
        child.material = glass
      } catch (e) {
        const mat = child.material
        if (mat) {
          try {
            mat.side = THREE.DoubleSide
            if ('envMapIntensity' in mat) mat.envMapIntensity = 0.9
            if ('metalness' in mat) mat.metalness = Math.min(0.12, mat.metalness ?? 0)
            if ('roughness' in mat) mat.roughness = Math.max(0.12, (mat.roughness ?? 1) * 0.7)
            mat.transparent = true
            mat.opacity = mat.opacity ?? 1
            mat.needsUpdate = true
          } catch (_) {
            // ignore
          }
        }
      }
    }
  })

  const scale = props.scale ?? [1, 1, 1]
  // prevent passing reflection down to primitive
  const { reflection, ...rest } = props
  return <primitive object={scene} scale={scale} {...rest} />
}

useGLTF.preload('/models/perfume_bottle.glb')

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
                  shadows
                  dpr={[1, 2]}
                  camera={{ position: [0, 0, 3.2], fov: 35 }}
                  gl={{ antialias: true }}
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
                  <ambientLight intensity={0.25} />
                  <hemisphereLight args={["#ffffff", "#444444", 0.35]} />
                  <directionalLight castShadow position={[5, 5, 5]} intensity={0.7} />
                  <spotLight position={[-5, 8, 5]} angle={0.35} penumbra={0.5} intensity={0.35} castShadow />
                  <Suspense fallback={null}>
                    <Environment preset="studio" background={false} />
                    <Model scale={[2.5, 2.5, 2.5]} position={[0, -0.4, 0]} rotation={[0, Math.PI, 0]} />
                  </Suspense>
                  <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={2} />
                </Canvas>
              </div>
            </div>

            <div className="reflection" aria-hidden>
              <div className="bottle-reflection-canvas">
                <Canvas
                  shadows={false}
                  dpr={[1, 1.5]}
                  camera={{ position: [0, 0, 3.2], fov: 35 }}
                  gl={{ antialias: true, alpha: true }}
                  onCreated={(state) => {
                    try {
                      ;(state.gl as any).physicallyCorrectLights = true
                      ;(state.gl as any).toneMapping = (THREE as any).ACESFilmicToneMapping
                      ;(state.gl as any).outputEncoding = (THREE as any).sRGBEncoding
                    } catch (e) {}
                  }}
                >
                  <ambientLight intensity={0.35} />
                  <hemisphereLight args={["#ffffff", "#444444", 0.28]} />
                  <directionalLight position={[2, 3, 2]} intensity={0.45} />
                  <Suspense fallback={null}>
                    <Environment preset="studio" background={false} />
                    {/* render a mirrored, dimmer model for the reflection; flip visually via CSS */}
                    <group position={[0, 0.4, 0]} rotation={[0, Math.PI, 0]} scale={[1, 1, 1]}>
                      <Model reflection scale={[2.5, 2.5, 2.5]} />
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
