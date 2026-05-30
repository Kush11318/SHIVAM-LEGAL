'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import LadyJustice from './LadyJustice';
import gsap from 'gsap';

interface CanvasContainerProps {
  scrollProgress: number;
  isFinalTransition: boolean;
  isLoaded: boolean;
}

// Custom elite lighting rig that responds to the loading state and tracks mouse coordinates
function CinematicLights({ isLoaded }: { isLoaded: boolean }) {
  const { mouse } = useThree();
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const swordLightRef = useRef<THREE.PointLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Fade in lighting dynamically during the swift cinematic reveal sequence
  useEffect(() => {
    if (!isLoaded) {
      if (rimLightRef.current) rimLightRef.current.intensity = 0;
      if (spotLightRef.current) spotLightRef.current.intensity = 0;
      if (keyLightRef.current) keyLightRef.current.intensity = 0;
      if (fillLightRef.current) fillLightRef.current.intensity = 0;
      if (swordLightRef.current) swordLightRef.current.intensity = 0;
      if (ambientLightRef.current) ambientLightRef.current.intensity = 0;
      return;
    }

    const tl = gsap.timeline();

    // T+0.1s: Soft ambient and front key/fill light fades in swiftly
    tl.to(ambientLightRef.current, {
      intensity: 0.90,
      duration: 1.0,
      ease: 'power2.out'
    }, '+=0.1');

    tl.to(fillLightRef.current, {
      intensity: 6.8,
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.8');

    tl.to(keyLightRef.current, {
      intensity: 8.5,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.9');

    // Strong golden rim lights illuminate the obsidian body swiftly
    tl.to(rimLightRef.current, {
      intensity: 16.5,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.9');

    // Elite spotlight highlights glossy details swiftly
    tl.to(spotLightRef.current, {
      intensity: 12.0,
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.9');

    // Dedicated high-intensity sword pointlight to make the golden blade gleam
    tl.to(swordLightRef.current, {
      intensity: 45.0, // Extremely intense localized pointlight right next to the blade!
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.9');

  }, [isLoaded]);

  useFrame(() => {
    // Spotlight gently tracks cursor for interactive reflections
    if (spotLightRef.current) {
      spotLightRef.current.position.x = THREE.MathUtils.lerp(spotLightRef.current.position.x, mouse.x * 6 - 5, 0.04);
      spotLightRef.current.position.y = THREE.MathUtils.lerp(spotLightRef.current.position.y, mouse.y * 5 + 8, 0.04);
    }
  });

  return (
    <>
      {/* Powerful Top-Front-Left key light for major highlights */}
      <directionalLight
        ref={keyLightRef}
        position={[-4, 5, 5]}
        intensity={0}
        color="#FDFBF7" // Champagne white key light
      />

      {/* Cinematic Golden Rim Light from behind to pop statue edges */}
      <directionalLight
        ref={rimLightRef}
        position={[4, 6, -8]}
        intensity={0}
        color="#E6C280" // Warm golden highlight
      />

      {/* Interactive Champagne Spotlight from upper left */}
      <spotLight
        ref={spotLightRef}
        position={[-5, 8, 5]}
        angle={0.45}
        penumbra={0.9}
        intensity={0}
        color="#FDFBF7" // Warm ivory/champagne
      />

      {/* Front Soft Fill Light to avoid complete pitch black on front details */}
      <directionalLight
        ref={fillLightRef}
        position={[2, -2, 6]}
        intensity={0}
        color="#EAD59E" // Warm gold fill
      />

      {/* Dedicated high-intensity PointLight sitting right in front of the golden sword */}
      <pointLight
        ref={swordLightRef}
        position={[2.5, -0.4, 1.6]} // Positioned right next to the sword blade in 3D space
        distance={5} // Localized area of influence
        decay={1.2} // Smooth physical falloff
        intensity={0}
        color="#FFF2CE" // Brilliant bright golden glow
      />

      {/* Soft atmospheric ambient floor light */}
      <ambientLight ref={ambientLightRef} intensity={0} color="#4A3C2B" />
    </>
  );
}

// Camera parallax drift to add breathing room and respond to mouse movement
function CameraController() {
  const { camera, mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow camera drift (breathing effect)
    const driftX = Math.sin(time * 0.25) * 0.15;
    const driftY = Math.cos(time * 0.3) * 0.1;

    // Smoothly lerp camera position based on mouse position + drift
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.9 + driftX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.9 + driftY, 0.05);
    camera.lookAt(0, -0.4, 0);
  });

  return null;
}

export default function CanvasContainer({ scrollProgress, isFinalTransition, isLoaded }: CanvasContainerProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#060606]">
      {/* Premium cinematic background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,18,18,0.15)_0%,rgba(6,6,6,0.98)_100%)] z-[1]" />
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        shadows={false}
        dpr={[1, 2]} // Razor-sharp high-resolution rendering up to 2x (Retina standard)
        gl={{ 
          antialias: true, 
          alpha: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance"
        }}
        className="w-full h-full relative z-0"
      >
        {/* Soft atmospheric distance fog to blend statue smoothly (relaxed start & end bounds) */}
        <fog attach="fog" args={["#060606", 6.5, 14]} />

        <Suspense fallback={null}>
          {/* Studio reflections environment map for bright gold & obsidian highlights */}
          <Environment preset="studio" intensity={0.85} />

          {/* Elite Lighting Setup */}
          <CinematicLights isLoaded={isLoaded} />

          {/* Interactive 3D Lady Justice Statue */}
          <LadyJustice 
            scrollProgress={scrollProgress}
            isFinalTransition={isFinalTransition}
            isLoaded={isLoaded}
          />
          
          {/* Subtle camera parallax and slow drift */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}

