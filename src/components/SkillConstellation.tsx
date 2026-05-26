'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SkillConstellation() {
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create a holographic 3D TorusKnot wireframe and dot cloud
    const knotGeometry = new THREE.TorusKnotGeometry(3, 0.8, 120, 16);

    // Circular glowing dot texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(59, 130, 246, 0.8)'); // Blue glow
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const dotTexture = createCircleTexture();

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x3b82f6, // Blue
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Indigo
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const knotPoints = new THREE.Points(knotGeometry, pointsMaterial);
    const knotLines = new THREE.Line(knotGeometry, lineMaterial);

    const knotGroup = new THREE.Group();
    knotGroup.add(knotPoints);
    knotGroup.add(knotLines);
    scene.add(knotGroup);

    // Bounding star particles
    const starCount = 100;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 15;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const starfield = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starfield);

    // Track scroll visibility
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Interactive mouse positioning
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.00015;
      targetY = (e.clientY - window.innerHeight / 2) * 0.00015;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const time = Date.now() * 0.0005;

      // Rotate torus knot
      knotGroup.rotation.y = time * 0.15;
      knotGroup.rotation.x = time * 0.08;

      // Mouse following lerp
      scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

      // Drift background star particles
      starfield.rotation.y = -time * 0.03;

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

      knotGeometry.dispose();
      pointsMaterial.dispose();
      dotTexture.dispose();
      lineMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
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
