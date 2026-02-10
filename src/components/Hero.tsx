import React, { Suspense, useRef, useEffect, useState } from "react";
import "../styles/Hero.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// CONSTANTS
// ============================================================================
const MODEL_PATH = "/models/perfume-.glb";

// Lerp smoothing (0.3 = responsive, smooth ~0.2s lag)
const LERP_SMOOTHING = 0.2;

const PRESET = "sunset"; // Environment preset for reflections (can be 'city', 'dawn', 'night', 'forest', 'apartment', 'studio', 'sunset' or a custom HDRI path)

// ============================================================================
// OPTIMIZED MODEL COMPONENT
// ============================================================================
function optimizeScene(scene: THREE.Group | THREE.Scene, isMobile: boolean): void {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.frustumCulled = true;
    child.castShadow = false;
    child.receiveShadow = false;
    if (child.material) {
      (child.material as THREE.Material).precision = "mediump";
    }
    if (isMobile && child.geometry && !child.geometry.attributes.normal) {
      child.geometry.computeVertexNormals();
    }
  });
}

function ScrollRotateModel({ isMobile, useClone = false }: { isMobile: boolean; useClone?: boolean }) {
  const { scene: originalScene } = useGLTF(MODEL_PATH);
  // Clone the scene for the reflection so it doesn't steal the original from the main canvas
  const scene = React.useMemo(
    () => (useClone ? originalScene.clone(true) : originalScene),
    [originalScene, useClone]
  );
  const groupRef = useRef<THREE.Group | null>(null);
  const velocityRef = useRef(0);
  const currentRotation = useRef(0);
  const lastScrollRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  // Optimize scene once on mount
  useEffect(() => {
    optimizeScene(scene, isMobile);
  }, [scene, isMobile]);

  useEffect(() => {
    function onScroll() {
      const current = window.scrollY;
      const delta = current - lastScrollRef.current;
      lastScrollRef.current = current;
      velocityRef.current += delta * 0.08;
    }

    // Wheel listener catches scroll-up intent even when already at top (scrollY=0)
    function onWheel(e: WheelEvent) {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        velocityRef.current += e.deltaY * 0.012;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;

    // Apply velocity and clamp
    const max = 0.16;
    velocityRef.current = Math.max(-max, Math.min(max, velocityRef.current));

    // Target = current + velocity, then decay velocity
    const target = currentRotation.current + velocityRef.current;
    velocityRef.current *= 0.92;
    if (Math.abs(velocityRef.current) < 1e-6) velocityRef.current = 0;

    // Smooth interpolation instead of direct assignment
    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      target,
      LERP_SMOOTHING
    );

    g.rotation.y = currentRotation.current;
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      <primitive
        object={scene}
        scale={[0.8, 0.8, 0.8]}
        position={[0, -0.4, 0]}
      />
    </group>
  );
}

// Preload model for instant rendering
useGLTF.preload(MODEL_PATH);

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Device detection ──────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── Pause rendering when off-screen (IntersectionObserver) ────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCanvasVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
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

            {/* SINGLE Canvas — no more second canvas for reflection */}
            <div className="bottle" ref={canvasRef}>
              <div className="bottle-canvas">
                <Canvas
                  shadows={false}
                  dpr={isMobile ? [0.75, 1] : [1, 1.5]}
                  frameloop={isCanvasVisible ? "always" : "never"}
                  camera={{ position: [0, 0.2, 3], fov: 35 }}
                  performance={{ min: 0.5 }}
                  gl={{
                    alpha: true,
                    antialias: !isMobile,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                    preserveDrawingBuffer: false,
                  }}
                >
                  {/* Lighting: ambient + key + fill + front */}
                  <ambientLight intensity={0.5} />
                  <directionalLight
                    position={[4, 6, 6]}
                    intensity={1.2}
                    castShadow={false}
                  />
                  <directionalLight
                    position={[-3, 4, -4]}
                    intensity={0.6}
                    castShadow={false}
                  />
                  {/* Front fill light — illuminates the face towards camera */}
                  <directionalLight
                    position={[0, 2, 5]}
                    intensity={0.2}
                    castShadow={false}
                  />

                  <Suspense fallback={null}>
                    <Environment
                      preset={PRESET}
                      background={false}
                      resolution={isMobile ? 64 : 128}
                    />
                    <ScrollRotateModel isMobile={isMobile} />
                  </Suspense>
                </Canvas>
              </div>
            </div>

            {/* Reflection — mirrors the bottle canvas via CSS */}
            <div className="reflection" aria-hidden>
              <div className="bottle-reflection-mirror">
                <Canvas
                  shadows={false}
                  dpr={isMobile ? [0.5, 0.75] : [0.75, 1]}
                  frameloop={isCanvasVisible ? "always" : "never"}
                  camera={{ position: [0, 0, 3.2], fov: 35 }}
                  performance={{ min: 0.3 }}
                  gl={{
                    alpha: true,
                    antialias: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                    preserveDrawingBuffer: false,
                  }}
                >
                  <ambientLight intensity={0.2} />
                  <directionalLight position={[3, 5, 5]} intensity={0.2} castShadow={false} />
                  <Suspense fallback={null}>
                    <Environment preset={PRESET} background={false} resolution={64} />
                    <ScrollRotateModel isMobile={isMobile} useClone />
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
