import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export const HelloGlass: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0, 18);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const dL1 = new THREE.DirectionalLight(0xa3ff12, 8);
    dL1.position.set(10, 10, 10);
    scene.add(dL1);

    const dL2 = new THREE.DirectionalLight(0x00f0ff, 6);
    dL2.position.set(-10, -5, 10);
    scene.add(dL2);

    const pL1 = new THREE.PointLight(0xff2e93, 8, 30);
    pL1.position.set(0, 4, 8);
    scene.add(pL1);

    const pL2 = new THREE.PointLight(0xffd600, 5, 20);
    pL2.position.set(5, -5, 5);
    scene.add(pL2);

    // ── Glass material ──
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.03,
      transmission: 0.97,
      ior: 1.55,
      thickness: 2.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.92,
      side: THREE.FrontSide,
    });

    // ── Group to hold the text ──
    const group = new THREE.Group();
    scene.add(group);

    // Floating particles in background for ambiance
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xa3ff12, size: 0.06, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // ── Load Font and create "hello" 3D text ──
    const loader = new FontLoader();
    let textMesh: THREE.Mesh | null = null;

    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        const textGeo = new TextGeometry('hello', {
          font,
          size: 3.2,
          depth: 1.1,
          curveSegments: 32,
          bevelEnabled: true,
          bevelThickness: 0.18,
          bevelSize: 0.1,
          bevelOffset: 0,
          bevelSegments: 12,
        });

        textGeo.computeBoundingBox();
        textGeo.center();

        textMesh = new THREE.Mesh(textGeo, glassMat);
        group.add(textMesh);

        // Add a slightly offset backface for depth/refraction richness
        const backMat = new THREE.MeshPhysicalMaterial({
          color: 0xaaccff,
          metalness: 0.1,
          roughness: 0.05,
          transmission: 0.85,
          ior: 1.4,
          thickness: 1.5,
          transparent: true,
          opacity: 0.3,
          side: THREE.BackSide,
        });
        const backMesh = new THREE.Mesh(textGeo, backMat);
        group.add(backMesh);
      },
      undefined,
      () => {
        // Fallback if font fails: use torus knot
        const fallbackGeo = new THREE.TorusKnotGeometry(3, 0.8, 160, 32, 2, 3);
        textMesh = new THREE.Mesh(fallbackGeo, glassMat);
        group.add(textMesh);
      }
    );

    // ── Mouse parallax ──
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Only react if mouse is in upper half of page (hero area)
      if (e.clientY > window.innerHeight) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = y * 0.5;   // tilt on Y axis from vertical mouse
      targetY = x * 0.7;   // tilt on X axis from horizontal mouse
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Animate ──
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth interpolation for parallax tilt
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      group.rotation.x = currentX + Math.sin(t * 0.3) * 0.05;
      group.rotation.y = currentY + Math.sin(t * 0.2) * 0.04;

      // Gentle floating bob
      group.position.y = Math.sin(t * 0.6) * 0.12;

      // Animate lights for dynamic caustic-like effect
      pL1.position.x = Math.sin(t * 0.7) * 6;
      pL1.position.y = Math.cos(t * 0.5) * 4;
      pL2.position.x = Math.cos(t * 0.9) * 5;
      pL2.position.y = Math.sin(t * 0.6) * 3;

      // Particle drift
      const positions = particleGeo.attributes['position'].array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.008;
        if (positions[i * 3 + 1] > 7) positions[i * 3 + 1] = -7;
      }
      particleGeo.attributes['position'].needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
