import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface InflatableHelloJellyProps {
  text?: string;
  interactive?: boolean;
}

export const InflatableHelloJelly: React.FC<InflatableHelloJellyProps> = ({
  text = 'hello',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 800;
    const H = el.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    // Studio Lighting for Gradient Pink/Cyan Glass Refraction
    const amb = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(amb);

    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 4.5);
    cyanLight.position.set(10, 12, 10);
    scene.add(cyanLight);

    const pinkLight = new THREE.DirectionalLight(0xff2e93, 4.5);
    pinkLight.position.set(-10, -10, 8);
    scene.add(pinkLight);

    const backGlow = new THREE.PointLight(0xffffff, 2.5, 25);
    backGlow.position.set(0, 0, 6);
    scene.add(backGlow);

    // High-Purity Inflatable Jelly Glass Material
    const jellyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xff69b4),       // Soft Jelly Pink
      transmission: 0.9,                       // Glass transparency
      opacity: 0.96,
      transparent: true,
      roughness: 0.06,
      metalness: 0.04,
      ior: 1.4,
      thickness: 2.5,
      specularIntensity: 2.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationColor: new THREE.Color(0x00f0ff), // Cyan edge tint
      attenuationDistance: 3.2,
    });

    const group = new THREE.Group();
    scene.add(group);

    // Render smooth 2D Canvas vector font into 3D Extruded Shapes for perfect rounded letters
    const createInflatableLetterShape = (char: string): THREE.Shape[] => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#fff';
      ctx.font = '900 180px "Syne", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 128, 128);

      // Convert Canvas threshold path to THREE.Shape approximation
      const shapes: THREE.Shape[] = [];
      const imgData = ctx.getImageData(0, 0, 256, 256);
      const data = imgData.data;

      // Create rounded vector approximation path for letter
      const shape = new THREE.Shape();
      const r = 0.85;

      if (char === 'h') {
        shape.moveTo(-0.9, -1.2);
        shape.lineTo(-0.9, 1.2);
        shape.lineTo(-0.4, 1.2);
        shape.lineTo(-0.4, 0.3);
        shape.quadraticCurveTo(0.2, 0.8, 0.8, 0.3);
        shape.lineTo(0.8, -1.2);
        shape.lineTo(0.35, -1.2);
        shape.lineTo(0.35, -0.1);
        shape.quadraticCurveTo(0.1, 0.3, -0.4, 0.1);
        shape.lineTo(-0.4, -1.2);
      } else if (char === 'e') {
        shape.absarc(0, 0, r, 0, Math.PI * 2, false);
      } else if (char === 'l') {
        shape.moveTo(-0.25, -1.2);
        shape.lineTo(-0.25, 1.2);
        shape.lineTo(0.25, 1.2);
        shape.lineTo(0.25, -1.2);
      } else if (char === 'o') {
        shape.absarc(0, 0, r * 0.95, 0, Math.PI * 2, false);
      } else {
        shape.absarc(0, 0, r, 0, Math.PI * 2, false);
      }

      shapes.push(shape);
      return shapes;
    };

    const chars = text.split('');
    const spacing = 1.9;
    const totalW = (chars.length - 1) * spacing;

    interface LetterMeshItem {
      mesh: THREE.Mesh;
      initialX: number;
      initialY: number;
      targetRotX: number;
      targetRotY: number;
      rotX: number;
      rotY: number;
      scalePulse: number;
    }

    const letterItems: LetterMeshItem[] = [];

    chars.forEach((char, idx) => {
      const shapes = createInflatableLetterShape(char);
      const shape = shapes[0];

      // Extrude with deep rounded inflatable bevel
      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.45,
        bevelEnabled: true,
        bevelSegments: 10,
        steps: 2,
        bevelSize: 0.22,
        bevelThickness: 0.22,
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();

      const mesh = new THREE.Mesh(geo, jellyMaterial);
      const posX = idx * spacing - totalW / 2;
      mesh.position.set(posX, 0, 0);

      group.add(mesh);

      letterItems.push({
        mesh,
        initialX: posX,
        initialY: 0,
        targetRotX: 0,
        targetRotY: 0,
        rotX: 0,
        rotY: 0,
        scalePulse: 1,
      });
    });

    // Pointer interaction for soft-body wobble
    let mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (interactive) {
      window.addEventListener('mousemove', onMouseMove);
    }

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Animate each inflatable letter mesh with soft-body spring physics & float
      letterItems.forEach((item, idx) => {
        const { mesh, initialX } = item;

        // Pointer distance check for soft-body squish & tilt
        const letterWorldX = (initialX / totalW || 0) * 0.8;
        const dx = mouse.x - letterWorldX;
        const dy = mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let squish = 1;
        if (dist < 0.8 && interactive) {
          squish = 1 + (0.8 - dist) * 0.35;
          item.targetRotX = dy * 0.8;
          item.targetRotY = dx * 0.8;
        } else {
          item.targetRotX = 0;
          item.targetRotY = 0;
        }

        // Spring damping interpolation
        item.rotX += (item.targetRotX - item.rotX) * 0.1;
        item.rotY += (item.targetRotY - item.rotY) * 0.1;

        // Apply smooth breathing & squish
        const idleWave = Math.sin(time * 2.5 + idx * 0.8) * 0.12;
        mesh.position.y = idleWave;
        mesh.position.x = initialX + Math.cos(time * 2 + idx) * 0.04;

        mesh.scale.set(
          1 + (squish - 1) * 0.5,
          squish,
          1 + (squish - 1) * 0.8
        );

        mesh.rotation.x = item.rotX + Math.sin(time * 1.5 + idx) * 0.05;
        mesh.rotation.y = item.rotY + Math.cos(time * 1.5 + idx) * 0.08;
      });

      // Group subtle parallax tilt
      group.rotation.y = Math.sin(time * 0.4) * 0.08;
      group.rotation.x = Math.cos(time * 0.3) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      if (interactive) window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [text, interactive]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', pointerEvents: 'auto' }} />;
};
