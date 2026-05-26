'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Card3DProps {
  id: string;
}

export default function Card3DCanvas({ id }: Card3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometries based on card ID
    let geometry: THREE.BufferGeometry;
    let color = 0x3b82f6; // default blue

    switch (id) {
      case 'career-pathfinder':
        // Octahedron (Multi-Agent Node structure)
        geometry = new THREE.OctahedronGeometry(1.6, 0);
        color = 0x3b82f6; // Blue
        break;
      case 'ai-interview':
        // Cylinder (Communication / Database Nodes)
        geometry = new THREE.CylinderGeometry(1, 1, 2, 8, 3, true);
        color = 0x6366f1; // Indigo
        break;
      case 'cv-analyzer':
        // Box/Cube (Parsed file structures)
        geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4, 2, 2, 2);
        color = 0x60a5fa; // Soft Blue
        break;
      case 'cv-builder':
        // Torus (Modular template ring)
        geometry = new THREE.TorusGeometry(1.1, 0.3, 8, 32);
        color = 0x3b82f6; // Blue
        break;
      case 'case-study':
        // Dodecahedron (Strategic planning)
        geometry = new THREE.DodecahedronGeometry(1.5, 0);
        color = 0x6366f1; // Indigo
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(1.5, 0);
        color = 0x3b82f6;
    }

    // Material with double sided wireframe for holographic blueprint feel
    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add extra glowing point vertices inside the shape for premium aesthetic
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);

    // Intersection observer to freeze rendering if card isn't visible on screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Track mouse coordinates over window to slightly offset rotations
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (e.clientX - windowHalfX) * 0.0004;
      targetY = (e.clientY - windowHalfY) * 0.0004;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Rotate shape
      mesh.rotation.y = elapsedTime * 0.35;
      mesh.rotation.x = elapsedTime * 0.2;
      
      points.rotation.y = elapsedTime * 0.35;
      points.rotation.x = elapsedTime * 0.2;

      // Mouse influence tilt
      scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    setIsLoaded(true);
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
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

      geometry.dispose();
      material.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    };
  }, [id]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full absolute inset-0 transition-opacity duration-1000 z-0 pointer-events-none ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
