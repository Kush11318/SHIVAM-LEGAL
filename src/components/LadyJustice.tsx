'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface LadyJusticeProps {
  scrollProgress: number; // 0 to 1
  isFinalTransition: boolean;
  isLoaded: boolean;
}

export default function LadyJustice({ scrollProgress, isFinalTransition, isLoaded }: LadyJusticeProps) {
  const { scene } = useGLTF('/models/Lady Justice.glb');
  const groupRef = useRef<THREE.Group>(null);
  const scalesRefs = useRef<THREE.Mesh[]>([]);
  const lastScroll = useRef(0);
  const scrollVelocity = useRef(0);
  const accumulatedTime = useRef(0);

  // Custom uniforms to animate the procedural obsidian and liquid gold shaders
  const customUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uGlowIntensity: { value: 0.4 },     // Veins intensity
      uEyeGlowIntensity: { value: 1.8 },  // Eyes glowing strip intensity
      uVeinIntensity: { value: 0.8 },
    };
  }, []);

  // Premium Physical Metallic Gold Material for Scales, Sword details
  const goldMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4AF37'), // Pure Metallic Gold
      metalness: 0.95, // High metallic sheen
      roughness: 0.25, // Satin-brushed finish to scatter light and look bright solid gold
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      emissive: new THREE.Color('#5A4315'), // Rich, bright warm golden self-glow
      emissiveIntensity: 0.75, // Cranked up to make gold pop
      side: THREE.DoubleSide
    });
  }, []);

  // Premium White Carrara Marble Material for the Hair
  const whiteMarbleMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FCFAF2'), // Pure warm white Carrara marble
      metalness: 0.12, // Dielectric marble sheen
      roughness: 0.30, // Smooth satin finish
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0,
      emissive: new THREE.Color('#3A3A3A'), // Soft inner glow to ensure it looks bright
      emissiveIntensity: 0.50,
      side: THREE.DoubleSide
    });
  }, []);

  // Procedural Brushed Obsidian with pulsating liquid gold veins
  const obsidianMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2d2d2d'), // Brighter slate-gray base for visual definitions
      metalness: 0.40, // Increased metallic sheen for highlights
      roughness: 0.35, // Balanced glossiness to catch ambient light
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      emissive: new THREE.Color('#161616'), // Soft ambient self-illumination to prevent dark shadows
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime;
      shader.uniforms.uGlowIntensity = customUniforms.uGlowIntensity;
      shader.uniforms.uEyeGlowIntensity = customUniforms.uEyeGlowIntensity;
      shader.uniforms.uVeinIntensity = customUniforms.uVeinIntensity;

      // Inject varying to pass local coordinates
      shader.vertexShader = `
        varying vec3 vLocalPosition;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vLocalPosition = position;
        `
      );

      // Inject Simplex Noise and procedural vein drawing into fragment shader
      shader.fragmentShader = `
        varying vec3 vLocalPosition;
        uniform float uTime;
        uniform float uGlowIntensity;
        uniform float uEyeGlowIntensity;
        uniform float uVeinIntensity;

        // 3D Simplex Noise for procedural marble/obsidian veins
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        ${shader.fragmentShader}
      `.replace(
        '#include <opaque_fragment>',
        `
        // Multi-octave turbulence noise for fine gold veins
        float n1 = snoise(vLocalPosition * 0.08);
        float n2 = snoise(vLocalPosition * 0.22 + vec3(uTime * 0.05));
        float veinVal = abs(n1 + n2 * 0.25);
        
        // Exquisite thin vein thresholding
        float vein = smoothstep(0.70, 0.74, veinVal);
        
        // Procedural black marble texture background (always visible, prevents black hole)
        float baseNoise = snoise(vLocalPosition * 0.04) * 0.5 + 0.5;
        vec3 baseMarbleColor = mix(vec3(0.06, 0.06, 0.06), vec3(0.18, 0.18, 0.18), baseNoise);
        
        // Apply procedural fine gray veins for anatomical definition
        float fineMarbleVeins = smoothstep(0.62, 0.68, abs(snoise(vLocalPosition * 0.12)));
        baseMarbleColor = mix(baseMarbleColor, vec3(0.35, 0.35, 0.35), fineMarbleVeins * 0.45);
        
        // Champagne liquid gold color
        vec3 goldColor = vec3(0.88, 0.72, 0.28);
        
        // Gentle pulsation for dynamic visual life
        float veinsPulse = 0.75 + 0.25 * sin(uTime * 1.5);
        vec3 veinEmissive = goldColor * vein * veinsPulse * uGlowIntensity * uVeinIntensity;
        
        // Coordinated glowing eye strips & blindfold trim
        // Local Space: Head is situated near [141, 45, -66]
        vec3 eyeLeft = vec3(139.5, 45.0, -64.0);
        vec3 eyeRight = vec3(142.5, 45.0, -64.0);
        
        float distL = distance(vLocalPosition, eyeLeft);
        float distR = distance(vLocalPosition, eyeRight);
        
        // Exquisite glowing strips in front of the eyes
        float eyeGlowL = smoothstep(1.5, 0.0, distL);
        float eyeGlowR = smoothstep(1.5, 0.0, distR);
        float eyesGlow = max(eyeGlowL, eyeGlowR);
        
        // Glowing trim along blindfold borders
        float trimHeight = 44.5;
        float trimGlow = smoothstep(1.6, 0.0, abs(vLocalPosition.y - trimHeight));
        float inFace = smoothstep(132.0, 136.0, vLocalPosition.x) * smoothstep(146.0, 142.0, vLocalPosition.x)
                     * smoothstep(-73.0, -70.0, vLocalPosition.z) * smoothstep(-62.0, -65.0, vLocalPosition.z);
        float trimsGlow = trimGlow * inFace * 0.75;
        
        // Sci-fi luxury pulsating glow
        float pulseEyes = 0.82 + 0.18 * sin(uTime * 2.8);
        vec3 eyesEmissive = goldColor * max(eyesGlow, trimsGlow) * pulseEyes * uEyeGlowIntensity;

        // Blend emissive glows directly into fragment output
        totalEmissiveRadiance += veinEmissive + eyesEmissive;
        
        // Overlay gold veins dynamically over procedurally textured dark marble base
        diffuseColor.rgb = mix(baseMarbleColor, goldColor, vein * 0.90 * uGlowIntensity);

        #include <opaque_fragment>
        `
      );
    };

    return material;
  }, [customUniforms]);

  // Symmetrical dynamic mesh classification
  const isHairMesh = (name: string) => {
    // Detailed primitives representing the hair
    const hairIndices = [9, 11];
    return hairIndices.some(idx => name.endsWith(`_${idx}`) || name === `Object_${idx}`);
  };

  const isGoldMesh = (name: string) => {
    // Only the large structural segments of the robes, dress, and main pedestal base remain black obsidian
    const obsidianIndices = [18, 19, 21, 22, 27];
    const isObsidian = obsidianIndices.some(idx => name.endsWith(`_${idx}`) || name === `Object_${idx}`);
    return !isObsidian;
  };

  // Traverse the GLB scene and apply PBR materials
  useEffect(() => {
    if (scene) {
      scalesRefs.current = []; // Clear array
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (isHairMesh(mesh.name)) {
            mesh.material = whiteMarbleMaterial;
          } else if (isGoldMesh(mesh.name)) {
            mesh.material = goldMaterial;
          } else {
            mesh.material = obsidianMaterial;
          }
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });
    }
  }, [scene, goldMaterial, obsidianMaterial]);

  // Smooth out scroll transformations
  const targetRotation = useRef({ x: 0.1, y: 0, z: 0 });
  const targetPosition = useRef({ x: 0, y: -2, z: 0 });
  const targetScale = useRef(2.2);

  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        targetScale.current = 1.3;
      } else {
        targetScale.current = 2.2;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // React to loading state & execute high-end cinematic GSAP reveal sequence
  useEffect(() => {
    if (!isLoaded) {
      // Completely hidden in deep shadows before user entry
      customUniforms.uEyeGlowIntensity.value = 0.0;
      customUniforms.uGlowIntensity.value = 0.0;
      return;
    }

    // Coordinated cinematic timeline
    const tl = gsap.timeline();

    // 1. T+0.0s: Golden glowing eyes illuminate first from dark shadows
    tl.to(customUniforms.uEyeGlowIntensity, {
      value: 1.3,
      duration: 0.8,
      ease: 'power3.out'
    });

    // 2. T+0.3s: Liquid gold veins start to light up and flow
    tl.to(customUniforms.uGlowIntensity, {
      value: 1.0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '-=0.5');

    // 3. Reveal ambient/materials slowly by rotating/floating into position
    tl.to(targetPosition.current, {
      x: window.innerWidth < 768 ? 0.2 : 1.95, // Set starting x position as it rises!
      y: window.innerWidth < 768 ? -1.1 : -0.75, // Shifted down slightly to sit perfectly under navigation
      duration: 1.5,
      ease: 'power3.out'
    }, '-=0.9');

  }, [isLoaded, customUniforms]);

  // React to scroll progress by updating camera target parameters
  useEffect(() => {
    if (!isLoaded) return; // Skip scroll updates until loaded

    const isMobile = window.innerWidth < 768;
    const baseScale = isMobile ? 1.15 : 1.85; // Proportioned to be slightly smaller for elegant framing

    if (isFinalTransition) {
      // Final section: Statue slowly transforms into a glowing golden silhouette in the center
      targetPosition.current = { x: 0, y: isMobile ? -1.2 : -2.0, z: isMobile ? 0.5 : 1.0 };
      targetRotation.current = { x: 0.1, y: Math.PI * 2, z: 0 };
      targetScale.current = baseScale * 1.2;
      
      // Animate material to glowing silhouette
      gsap.to(customUniforms.uGlowIntensity, {
        value: 6.0,
        duration: 2.0,
        ease: 'power2.out'
      });
      gsap.to(customUniforms.uEyeGlowIntensity, {
        value: 2.0,
        duration: 2.0,
        ease: 'power2.out'
      });
    } else {
      // Reset to standard intensity on scroll back up (elevated to keep it popping)
      gsap.to(customUniforms.uGlowIntensity, {
        value: 1.5, // Increased from 1.0 to keep gold veins popping
        duration: 1.5,
        ease: 'power2.out'
      });
      gsap.to(customUniforms.uEyeGlowIntensity, {
        value: 1.6, // Increased from 1.3 to keep eyes glowing brightly
        duration: 1.5,
        ease: 'power2.out'
      });

      // Story-driven positions based on scrollProgress
      if (scrollProgress < 0.15) {
        // Hero & Intro
        const factor = scrollProgress / 0.15;
        targetPosition.current = { 
          x: isMobile ? 0.2 : 1.95, // Shifted right slightly
          y: isMobile ? -1.1 : -0.75, // Shifted down slightly to match the entrance Y underneath navbar
          z: isMobile ? 0.2 : 1.2 
        };
        targetRotation.current = { x: 0.05, y: -0.5 + factor * 0.8, z: 0 };
        targetScale.current = baseScale * 1.25;
      } else if (scrollProgress < 0.35) {
        // About
        const factor = (scrollProgress - 0.15) / 0.2;
        targetPosition.current = { 
          x: isMobile ? 0.2 - factor * 0.2 : 1.95 - factor * 0.85, // Shifted right slightly
          y: isMobile ? -1.0 : -0.3 - factor * 0.3, 
          z: isMobile ? 0.2 : 1.2 - factor * 0.4
        };
        targetRotation.current = { x: 0.05 + factor * 0.15, y: 0.3 + factor * 0.9, z: 0 };
        targetScale.current = baseScale * 1.25;
      } else if (scrollProgress < 0.55) {
        // Expertise
        const factor = (scrollProgress - 0.35) / 0.2;
        targetPosition.current = { 
          x: isMobile ? 0 : 1.0 - factor * 2.4, 
          y: isMobile ? -1.4 : -0.6 - factor * 0.6, 
          z: isMobile ? -0.2 : 0.8 - factor * 0.6 
        };
        targetRotation.current = { x: 0.2 + factor * 0.1, y: 1.2 - factor * 1.4, z: 0 };
        targetScale.current = baseScale * 0.95;
      } else if (scrollProgress < 0.75) {
        // Experience
        const factor = (scrollProgress - 0.55) / 0.2;
        targetPosition.current = { 
          x: isMobile ? 0 : -1.4 + factor * 1.4, 
          y: isMobile ? -1.2 : -1.2 - factor * 0.4, 
          z: isMobile ? -0.2 : 0.2 + factor * 0.3
        };
        targetRotation.current = { x: 0.3 - factor * 0.2, y: -0.2 + factor * 2.2, z: 0 };
        targetScale.current = baseScale * 1.0;
      } else {
        // Philosophy
        const factor = Math.min(1, (scrollProgress - 0.75) / 0.13);
        targetPosition.current = { 
          x: isMobile ? 0.3 : factor * 0.8, 
          y: isMobile ? -0.4 : -1.6 + factor * 0.8, 
          z: isMobile ? 2.0 : 0.5 + factor * 2.8 // Zoomed in much closer to emphasize the swinging details
        };
        targetRotation.current = { x: 0.1 + factor * 0.05, y: 2.0 + factor * 0.5, z: 0 };
        targetScale.current = baseScale * 1.4;
      }
    }
  }, [scrollProgress, isFinalTransition, isLoaded, customUniforms]);

  // Frameloop animation for smooth interpolation, gentle idle float, and swinging scales
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // 1. Calculate scroll velocity and direction
    const currentScroll = scrollProgress;
    const scrollDelta = currentScroll - lastScroll.current;
    
    // Smooth scroll velocity using a lightweight lerp filter
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, Math.abs(scrollDelta) * 85.0, 0.05);
    
    // 2. Dynamic Liquid Gold flow speed and vein intensity boost
    const frameDelta = Math.min(0.08, state.clock.getDelta() || 0.016);
    const speedMultiplier = 1.0 + scrollVelocity.current * 4.0; // flow rushes 4x faster during scrolls!
    accumulatedTime.current += frameDelta * speedMultiplier;
    
    // Update time uniform for procedural noise shaders
    customUniforms.uTime.value = accumulatedTime.current;
    
    // Veins glow brighter during active scroll! (Dynamic emphasis)
    const glowIntensityBoost = scrollVelocity.current * 1.35;
    customUniforms.uVeinIntensity.value = THREE.MathUtils.lerp(
      customUniforms.uVeinIntensity.value,
      0.8 + glowIntensityBoost,
      0.08
    );

    const time = accumulatedTime.current;

    // 4. Subtle camera inertia tilt (Pitch & Directional Yaw)
    const rotationDrift = Math.cos(time * 0.4) * 0.015;
    const inertiaTiltX = scrollVelocity.current * 0.18; // pitch tilt on velocity
    const inertiaTiltY = scrollDelta * 2.2; // yaw swing based on scroll direction!
    
    // 5. Gentle idle floating for the entire statue (breath effect)
    const floatOffset = Math.sin(time * 0.8) * 0.06;

    // Smooth lerp for position
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosition.current.x, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosition.current.y + floatOffset, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosition.current.z, 0.06);

    // Smooth lerp for rotation with scroll inertia
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x + inertiaTiltX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y + rotationDrift + inertiaTiltY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotation.current.z, 0.06);

    // Smooth lerp for scale
    const targetS = targetScale.current;
    groupRef.current.scale.set(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetS, 0.06),
      THREE.MathUtils.lerp(groupRef.current.scale.y, targetS, 0.06),
      THREE.MathUtils.lerp(groupRef.current.scale.z, targetS, 0.06)
    );

    // Record last scroll progress for next frame calculations
    lastScroll.current = currentScroll;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the asset
useGLTF.preload('/models/Lady Justice.glb');

