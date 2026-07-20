import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  variant?: 'hero' | 'footer';
}

export const ThreeScene: React.FC<Props> = ({ variant = 'hero' }) => {
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
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = variant === 'hero' ? 14 : 12;

    // ── Lights for physical glass material ──
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const dL1 = new THREE.DirectionalLight(0xa3ff12, 5);   // lime key light
    dL1.position.set(8, 10, 8);
    scene.add(dL1);

    const dL2 = new THREE.DirectionalLight(0x00f0ff, 4);   // cyan fill
    dL2.position.set(-10, -6, 8);
    scene.add(dL2);

    const pL = new THREE.PointLight(0xff2e93, 6, 25);      // pink centre glow
    pL.position.set(0, 0, 6);
    scene.add(pL);

    const pL2 = new THREE.PointLight(0xffd600, 4, 20);     // gold accent
    pL2.position.set(6, -4, 4);
    scene.add(pL2);

    // ── Glass Material (MeshPhysicalMaterial) ──
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.04,
      transmission: 0.96,        // transparent like liquid glass
      ior: 1.52,
      thickness: 3.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.88,
    });

    // Chrome/metallic variant for accents
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdde8ff,
      metalness: 0.97,
      roughness: 0.03,
    });

    // ── Build scene objects that mimic "liquid blob letters" ──
    const group = new THREE.Group();

    if (variant === 'hero') {
      // Main large glass torus-knot core — looks like a tangled liquid form
      const core = new THREE.Mesh(
        new THREE.TorusKnotGeometry(2.6, 0.72, 200, 40, 2, 3),
        glassMat
      );
      group.add(core);

      // Surrounding glass spheres of varying sizes (liquid drops)
      const dropSizes = [0.55, 0.35, 0.45, 0.65, 0.4, 0.3, 0.5, 0.38];
      dropSizes.forEach((r, i) => {
        const angle  = (i / dropSizes.length) * Math.PI * 2;
        const spread = 4.5 + (i % 3) * 1.0;
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(r, 48, 48),
          i % 3 === 0 ? chromeMat : glassMat
        );
        m.position.set(
          Math.cos(angle) * spread,
          Math.sin(angle) * spread,
          (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.25)
        );
        group.add(m);
      });

      // A few flat glass rings (disc-like) for extra depth
      const ringGeo = new THREE.TorusGeometry(1.6, 0.25, 32, 80);
      const ring1 = new THREE.Mesh(ringGeo, glassMat);
      ring1.rotation.x = Math.PI / 2.5;
      ring1.position.set(3.5, -1.5, -1);
      group.add(ring1);

    } else {
      // Footer: stacked rings + spheres for "CRAFT TASTE" feel
      [0, 1, 2].forEach(i => {
        const r = new THREE.Mesh(
          new THREE.TorusGeometry(2.5 + i * 1.4, 0.38, 32, 100),
          i % 2 === 0 ? glassMat : chromeMat
        );
        r.rotation.x = Math.PI / 3 + i * 0.25;
        r.rotation.y = i * 0.55;
        group.add(r);
      });
      const bigSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 64, 64),
        glassMat
      );
      group.add(bigSphere);
    }

    scene.add(group);

    // ── Mouse parallax ──
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 0.8;
      my = ((e.clientY - rect.top)  / rect.height - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Animate ──
    let raf: number;
    const clock = new THREE.Clock();
    const baseSpeed = variant === 'hero' ? 0.22 : 0.15;

    const animate = () => {
      const t = clock.getElapsedTime();
      // Continuous slow spin
      group.rotation.x += (my * 0.6 - group.rotation.x) * 0.04 + Math.sin(t * 0.4) * 0.003;
      group.rotation.y += (mx * 0.6 - group.rotation.y) * 0.04 + baseSpeed * 0.016;
      // Animate inner children lightly
      group.children.forEach((child, i) => {
        if (i > 0) {
          child.rotation.x = t * (0.1 + i * 0.03);
          child.rotation.z = t * (0.05 + i * 0.02);
        }
      });
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
      el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
};
