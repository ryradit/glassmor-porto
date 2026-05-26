'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function NeuralNetwork() {
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
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 45;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    // Randomize initial positions & velocities inside a bounding cube
    const limit = 4.5;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * limit * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * limit * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * limit * 2;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008
        )
      );
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Glow circle texture for particles
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(59, 130, 246, 0.8)'); // Blue glow
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const dotTexture = createCircleTexture();

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x3b82f6, // Blue
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create line segments for connecting edges
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Indigo edges
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    // We will dynamically rebuild line positions inside the animation loop
    const maxConnections = 150;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const connections = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connections);

    // Tracking visibility to pause when scrolled away
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Interaction tracking
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.0002;
      targetY = (e.clientY - window.innerHeight / 2) * 0.0002;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return; // Freeze calculations if component is off-screen

      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // 1. Update particle positions
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        // Bounce off walls
        if (Math.abs(posArray[i * 3]) > limit) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > limit) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > limit) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // 2. Compute connections based on distance threshold
      let lineIndex = 0;
      const linePosArray = lineGeometry.attributes.position.array as Float32Array;
      const thresholdSq = 2.4 * 2.4; // connect if distance < 2.4 units

      for (let i = 0; i < particleCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < thresholdSq && lineIndex < maxConnections) {
            // Add vertex 1
            linePosArray[lineIndex * 6] = x1;
            linePosArray[lineIndex * 6 + 1] = y1;
            linePosArray[lineIndex * 6 + 2] = z1;

            // Add vertex 2
            linePosArray[lineIndex * 6 + 3] = x2;
            linePosArray[lineIndex * 6 + 4] = y2;
            linePosArray[lineIndex * 6 + 5] = z2;

            lineIndex++;
          }
        }
      }
      
      // Clear remainder of the line coordinate buffer
      for (let k = lineIndex; k < maxConnections; k++) {
        linePosArray[k * 6] = 0;
        linePosArray[k * 6 + 1] = 0;
        linePosArray[k * 6 + 2] = 0;
        linePosArray[k * 6 + 3] = 0;
        linePosArray[k * 6 + 4] = 0;
        linePosArray[k * 6 + 5] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // 3. Rotate scene slightly toward mouse cursor
      scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

      // Rotate group as a whole
      particles.rotation.y += 0.001;
      connections.rotation.y += 0.001;

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
      resizeObserver.disconnect();
      observer.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      dotTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full absolute inset-0 transition-opacity duration-1000 z-0 pointer-events-none ${
        isLoaded ? 'opacity-50' : 'opacity-0'
      }`}
    />
  );
}
