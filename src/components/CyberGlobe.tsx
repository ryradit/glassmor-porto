'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function CyberGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create a dot-grid Earth Sphere
    const sphereRadius = 4;
    const sphereSegments = 45;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereSegments, sphereSegments);
    
    // Custom material for points to make them circular and glowing
    // We create a tiny canvas texture for the dot particles to make them smooth round circles
    const createCircleTexture = () => {
      const size = 16;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw circular gradient
        const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(59, 130, 246, 0.8)'); // Blue glow
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const dotTexture = createCircleTexture();

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x3b82f6, // Blue
    });

    const globePoints = new THREE.Points(sphereGeometry, pointsMaterial);
    scene.add(globePoints);

    // Add glowing wireframe shell slightly larger than the points
    const shellGeometry = new THREE.SphereGeometry(sphereRadius + 0.05, 18, 18);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1, // Indigo
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    });
    const globeShell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(globeShell);

    // Add cybernetic orbital rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const createOrbitRing = (radius: number, color: number, rotationX: number, rotationY: number) => {
      const ringGeom = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = rotationX;
      ring.rotation.y = rotationY;
      ringGroup.add(ring);
      
      // Add a couple of satellite dots on the ring
      const satCount = 2;
      for (let i = 0; i < satCount; i++) {
        const satGeom = new THREE.SphereGeometry(0.12, 8, 8);
        const satMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });
        const sat = new THREE.Mesh(satGeom, satMat);
        // Position at intervals on the ring
        const angle = (i * Math.PI) + (Math.random() * 0.5);
        sat.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        ring.add(sat);
      }
    };

    createOrbitRing(sphereRadius + 1.2, 0x3b82f6, Math.PI / 2.3, Math.PI / 6); // Blue ring
    createOrbitRing(sphereRadius + 1.8, 0x6366f1, Math.PI / 1.7, -Math.PI / 4); // Indigo ring

    // Drift starfield background
    const starsCount = 350;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      // Set random coordinates in a box around the scene
      starPositions[i] = (Math.random() - 0.5) * 40;
      starPositions[i + 1] = (Math.random() - 0.5) * 40;
      starPositions[i + 2] = (Math.random() - 0.5) * 40 - 5; // offset backward slightly

      // Add cool cyan/blue/white star colors
      const mix = Math.random();
      if (mix < 0.4) {
        starColors[i] = 0.23; // R (blue)
        starColors[i + 1] = 0.51; // G
        starColors[i + 2] = 0.96; // B
      } else if (mix < 0.7) {
        starColors[i] = 0.38; // R (indigo)
        starColors[i + 1] = 0.4; // G
        starColors[i + 2] = 0.94; // B
      } else {
        starColors[i] = 1.0; // White
        starColors[i + 1] = 1.0;
        starColors[i + 2] = 1.0;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starfield = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starfield);

    // Interaction tracking
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX - windowHalfX) * 0.0003;
      targetY = (event.clientY - windowHalfY) * 0.0003;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Base rotations
      globePoints.rotation.y = elapsedTime * 0.06;
      globeShell.rotation.y = elapsedTime * 0.06;
      
      // Counter-rotations for orbital rings
      ringGroup.rotation.y = -elapsedTime * 0.08;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      // Drift starfield background
      starfield.rotation.y = elapsedTime * 0.01;
      starfield.rotation.x = Math.cos(elapsedTime * 0.005) * 0.02;

      // Mouse interactive tilt (smooth easing/lerp)
      scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    setIsLoaded(true);
    animate();

    // Resize Handler
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose materials/geometries to prevent memory leaks
      sphereGeometry.dispose();
      pointsMaterial.dispose();
      dotTexture.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full absolute inset-0 transition-opacity duration-1000 z-0 pointer-events-none ${
        isLoaded ? 'opacity-70' : 'opacity-0'
      }`}
    />
  );
}
