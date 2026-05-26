'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function PulsingWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 6, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create wave grid
    const columns = 45;
    const rows = 45;
    const spacing = 0.35;
    
    const count = columns * rows;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Initialize positions on a flat grid
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const i = (c * rows + r) * 3;
        positions[i] = (c - columns / 2) * spacing;     // X coordinate
        positions[i + 1] = 0;                             // Y coordinate (Z in math, height)
        positions[i + 2] = (r - rows / 2) * spacing;      // Z coordinate (Y in math)

        // Default colors
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular glowing particle texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)'); // Glow
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const dotTexture = createCircleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.18,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const waveGrid = new THREE.Points(geometry, material);
    scene.add(waveGrid);

    // Interactive mouse and click trackers
    let targetX = 0;
    let targetY = 0;
    
    // Shockwave ripple state
    let rippleActive = false;
    let rippleTime = 0;
    let rippleCenterX = 0;
    let rippleCenterZ = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.003;
      targetY = (e.clientY - window.innerHeight / 2) * 0.003;
    };

    const onClick = (e: MouseEvent) => {
      rippleActive = true;
      rippleTime = 0;
      rippleCenterX = ((e.clientX / window.innerWidth) - 0.5) * 16;
      rippleCenterZ = ((e.clientY / window.innerHeight) - 0.5) * 16;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Visibility observer to save CPU cycles when scrolled away
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationId: number;
    let countTime = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      countTime += 0.035;

      // Handle ripple animation timeline
      if (rippleActive) {
        rippleTime += 0.08;
        if (rippleTime > 6) {
          rippleActive = false;
        }
      }

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
      const colorArray = colorAttr.array as Float32Array;

      // Calculate undulation waves using sine / cosine math
      for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
          const i = (c * rows + r) * 3;
          const x = posArray[i];
          const z = posArray[i + 2];

          // Distance from the center plus mouse-induced center shift
          const dx = x - targetX;
          const dz = z - targetY;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // 1. Core undulation wave height (Y)
          let yVal = Math.sin(dist * 0.7 - countTime) * 0.45 + Math.cos((x + z) * 0.3 - countTime * 0.5) * 0.25;

          // 2. Shockwave ripple height (Y)
          if (rippleActive) {
            const rx = x - rippleCenterX;
            const rz = z - rippleCenterZ;
            const rdist = Math.sqrt(rx * rx + rz * rz);
            const waveFront = rippleTime * 2.2;
            const distFromWaveFront = Math.abs(rdist - waveFront);
            
            if (distFromWaveFront < 2.0) {
              const envelope = (1.0 - rippleTime / 6) * Math.cos(distFromWaveFront * Math.PI / 2.0);
              yVal += envelope * 1.5 * Math.sin(rdist * 2.5 - rippleTime * 5.0);
            }
          }

          posArray[i + 1] = yVal;

          // 3. Dynamic color mapping based on height
          const normalized = (yVal + 0.8) / 2.3;
          const clamped = Math.max(0, Math.min(1, normalized));

          if (clamped > 0.6) {
            const t = (clamped - 0.6) / 0.4;
            colorArray[i] = 0.23 + (0.58 - 0.23) * t;      // R
            colorArray[i + 1] = 0.51 + (0.77 - 0.51) * t;  // G
            colorArray[i + 2] = 0.96 + (0.99 - 0.96) * t;  // B
          } else {
            const t = clamped / 0.6;
            colorArray[i] = 0.38 + (0.23 - 0.38) * t;      // R
            colorArray[i + 1] = 0.40 + (0.51 - 0.40) * t;  // G
            colorArray[i + 2] = 0.94 + (0.96 - 0.94) * t;  // B
          }
        }
      }
      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Rotate camera angle slightly based on mouse
      camera.position.x += (targetX * 0.5 - camera.position.x) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    setIsLoaded(true);
    animate();

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      resizeObserver.disconnect();
      observer.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      dotTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full absolute inset-0 transition-opacity duration-1000 z-0 pointer-events-none ${
        isLoaded ? 'opacity-40' : 'opacity-0'
      }`}
    />
  );
}
