'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  areaWidth?: number;
  areaHeight?: number;
  areaDepth?: number;
  speed?: number;
}

export default function Particles({
  count = 350,
  areaWidth = 15,
  areaHeight = 12,
  areaDepth = 10,
  speed = 0.35,
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle data: positions, random scales, random phase shifts
  const [positions, phases, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random coordinates inside a bounding box surrounding the statue
      pos[i * 3] = THREE.MathUtils.randFloatSpread(areaWidth);
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(areaHeight);
      pos[i * 3 + 2] = THREE.MathUtils.randFloatSpread(areaDepth);

      // Phase offset for sinusoidal horizontal wind swaying
      phs[i] = Math.random() * Math.PI * 2;

      // Varied scales for visual depth
      scl[i] = THREE.MathUtils.randFloat(0.5, 2.0);
    }
    return [pos, phs, scl];
  }, [count, areaWidth, areaHeight, areaDepth]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positionsAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idxX = i * 3;
      const idxY = i * 3 + 1;
      const idxZ = i * 3 + 2;

      // Slow continuous upward drift
      array[idxY] += speed * 0.02 * scales[i];

      // Organic horizontal wind swaying
      array[idxX] += Math.sin(time * 0.5 + phases[i]) * 0.003;
      array[idxZ] += Math.cos(time * 0.3 + phases[i]) * 0.002;

      // Reset particles when they drift out of upper bounds (creates a continuous loop)
      if (array[idxY] > areaHeight / 2) {
        array[idxY] = -areaHeight / 2;
        array[idxX] = THREE.MathUtils.randFloatSpread(areaWidth);
        array[idxZ] = THREE.MathUtils.randFloatSpread(areaDepth);
      }
    }
    positionsAttr.needsUpdate = true;

    // Slow global rotation for visual depth
    pointsRef.current.rotation.y = time * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#EAD59E" // Premium rich gold / champagne glow
        size={0.065}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

