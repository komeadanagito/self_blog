import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeGlassTextProps {
  type?: 'hero' | 'footer';
}

export const ThreeGlassText: React.FC<ThreeGlassTextProps> = ({ type = 'hero' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    container.appendChild(renderer.domElement);

    // 2. Lighting & HDRI Simulation
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xa3ff12, 3);
    light1.position.set(12, 12, 12);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x00f0ff, 2.5);
    light2.position.set(-12, -12, 12);
    scene.add(light2);

    const pointLight = new THREE.PointLight(0xff2e93, 4, 30);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // 3. Materials
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.5,
      thickness: 3.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.9
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f5,
      metalness: 0.98,
      roughness: 0.04
    });

    const mainGroup = new THREE.Group();

    // Create 3D Sculptured Bubble Objects mimicking liquid text letters
    if (type === 'hero') {
      // Create multi-torus sculpture representing 'hello'
      const knotGeo = new THREE.TorusKnotGeometry(3.2, 0.9, 128, 32);
      const mainKnot = new THREE.Mesh(knotGeo, glassMat);
      mainGroup.add(mainKnot);

      // Surrounding liquid drops
      for (let i = 0; i < 8; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.4 + Math.random() * 0.6, 32, 32);
        const mesh = new THREE.Mesh(sphereGeo, i % 2 === 0 ? glassMat : chromeMat);
        const angle = (i / 8) * Math.PI * 2;
        const radius = 5 + Math.random() * 2;
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 4);
        mainGroup.add(mesh);
      }
    } else {
      // Footer sculpture: liquid ring array
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(3 + i * 1.5, 0.5, 32, 100);
        const ring = new THREE.Mesh(ringGeo, i % 2 === 0 ? glassMat : chromeMat);
        ring.rotation.x = Math.PI / 3 + i * 0.2;
        ring.rotation.y = i * 0.4;
        mainGroup.add(ring);
      }
    }

    scene.add(mainGroup);

    // 4. Mouse Move Interaction
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = y * 0.6;
      targetY = x * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.05 + Math.sin(t * 0.5) * 0.002;
      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.05 + Math.cos(t * 0.5) * 0.003;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  );
};
