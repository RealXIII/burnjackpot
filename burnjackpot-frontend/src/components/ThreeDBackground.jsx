import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = () => {
  const meshRef = useRef();
  const particleCount = 1000;
  const dummy = new THREE.Object3D();

  // Générer une texture circulaire en interne
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 165, 0, 1)'); // Centre orange
  gradient.addColorStop(1, 'rgba(255, 165, 0, 0)'); // Bord transparent
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);

  // Initialiser les positions et données
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    velocities[i * 3] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 1] = Math.random() * 0.2 + 0.1;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      for (let i = 0; i < particleCount; i++) {
        dummy.position.set(
          positions[i * 3] += velocities[i * 3],
          positions[i * 3 + 1] += velocities[i * 3 + 1],
          positions[i * 3 + 2] += velocities[i * 3 + 2]
        );

        if (dummy.position.y > 100) {
          dummy.position.y = -100;
          dummy.position.x = (Math.random() - 0.5) * 200;
          dummy.position.z = (Math.random() - 0.5) * 50;
          velocities[i * 3 + 1] = Math.random() * 0.2 + 0.1;
        }

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, particleCount]}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        color={0xffa500}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
              #include <dithering_fragment>
              float alpha = opacity * (1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - vec2(0.5))));
              gl_FragColor.a *= alpha;
            `
          );
        }}
      />
    </instancedMesh>
  );
};

const ThreeDBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <Canvas>
        <ambientLight intensity={0.3} />
        <Particles />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;