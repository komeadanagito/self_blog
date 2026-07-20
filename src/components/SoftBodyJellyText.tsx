import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SoftBodyJellyTextProps {
  text: string;
  colorHex?: number;   // Pure Bubblegum Pink
  accentHex?: number;  // Cyan Accent
  interactive?: boolean;
}

export const SoftBodyJellyText: React.FC<SoftBodyJellyTextProps> = ({
  text,
  colorHex = 0xff69b4,   // High-purity Pink
  accentHex = 0x00f0ff,  // High-purity Cyan
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 800;
    const H = el.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    el.appendChild(renderer.domElement);

    // Studio Dual-Tone Lights (Cyan & Pink)
    const amb = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(amb);

    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    cyanLight.position.set(8, 10, 8);
    scene.add(cyanLight);

    const pinkLight = new THREE.DirectionalLight(0xff1493, 3.5);
    pinkLight.position.set(-8, -8, 8);
    scene.add(pinkLight);

    const centerPoint = new THREE.PointLight(0xffffff, 2.0, 20);
    centerPoint.position.set(0, 0, 8);
    scene.add(centerPoint);

    // Inflatable Jelly Glass Material
    const jellyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      transmission: 0.92,       // Clear glass jelly
      opacity: 0.98,
      transparent: true,
      roughness: 0.05,
      metalness: 0.02,
      ior: 1.42,
      thickness: 2.2,
      specularIntensity: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color(accentHex),
      attenuationDistance: 3.5,
    });

    const letterGroup = new THREE.Group();
    scene.add(letterGroup);

    // Helper: Build inflatable jelly letter geometries using smooth parametric tubes & metaballs
    const buildJellyLetter = (char: string): THREE.BufferGeometry[] => {
      const geos: THREE.BufferGeometry[] = [];

      const createTube = (points: THREE.Vector3[], radius = 0.52) => {
        const curve = new THREE.CatmullRomCurve3(points);
        return new THREE.TubeGeometry(curve, 32, radius, 16, false);
      };

      const createRing = (r: number, tubeR = 0.5) => {
        return new THREE.TorusGeometry(r, tubeR, 16, 32);
      };

      const c = char.toLowerCase();

      if (c === 'h') {
        geos.push(createTube([new THREE.Vector3(-0.9, -1.2, 0), new THREE.Vector3(-0.9, 1.2, 0)]));
        geos.push(createTube([new THREE.Vector3(0.9, -1.2, 0), new THREE.Vector3(0.9, 1.2, 0)]));
        geos.push(createTube([new THREE.Vector3(-0.9, 0, 0), new THREE.Vector3(0.9, 0, 0)]));
      } else if (c === 'e') {
        geos.push(createRing(0.85, 0.48));
        geos.push(createTube([new THREE.Vector3(-0.85, 0, 0), new THREE.Vector3(0.85, 0, 0)]));
      } else if (c === 'l') {
        geos.push(createTube([new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)]));
      } else if (c === 'o') {
        geos.push(createRing(0.95, 0.52));
      } else if (c === 'c') {
        geos.push(createRing(0.9, 0.5));
      } else if (c === 'r' || c === 'a' || c === 'f' || c === 't' || c === '&' || c === 's') {
        // Generic inflatable jelly torus/knot representation for other letters
        geos.push(new THREE.TorusKnotGeometry(0.75, 0.42, 48, 16, 2, 3));
      } else {
        geos.push(createRing(0.8, 0.45));
      }

      return geos;
    };

    // Parse text characters into 3D Jelly Letters
    const chars = text.split('');
    const spacing = 2.1;
    const totalW = (chars.length - 1) * spacing;
    const letterMeshes: { mesh: THREE.Mesh; origPos: Float32Array; velocity: Float32Array }[] = [];

    chars.forEach((char, idx) => {
      if (char === ' ') return;
      const geos = buildJellyLetter(char);

      geos.forEach((geo) => {
        const posAttr = geo.attributes.position;
        const origPos = new Float32Array(posAttr.array);
        const velocity = new Float32Array(posAttr.array.length);

        const mesh = new THREE.Mesh(geo, jellyMaterial);
        mesh.position.x = idx * spacing - totalW / 2;

        letterGroup.add(mesh);
        letterMeshes.push({ mesh, origPos, velocity });
      });
    });

    // Pointer Raycaster for Soft-body Poke Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let mouseSpeed = 0;
    let prevMouse = { x: 0, y: 0 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    if (interactive) {
      window.addEventListener('mousemove', onPointerMove);
    }

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Soft-body Fluid Animation per letter
      letterMeshes.forEach(({ mesh, origPos, velocity }) => {
        const geo = mesh.geometry as THREE.BufferGeometry;
        const posAttr = geo.attributes.position;
        const posArray = posAttr.array as Float32Array;
        const normalAttr = geo.attributes.normal;
        const normalArray = normalAttr?.array as Float32Array;

        // Pointer proximity check
        let isHit = false;
        let hitLocalPoint = new THREE.Vector3();

        if (interactive) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObject(mesh);
          if (intersects.length > 0) {
            isHit = true;
            hitLocalPoint = intersects[0].point.clone();
            mesh.worldToLocal(hitLocalPoint);
          }
        }

        const pushRadius = 1.8;
        const pushForce = Math.min(mouseSpeed * 0.008 + 0.1, 0.25);
        const stiffness = 0.12;
        const damping = 0.84;

        for (let i = 0; i < posArray.length; i += 3) {
          // Normal direction for clean radial inflation/deflation
          const nx = normalArray ? normalArray[i] : 0;
          const ny = normalArray ? normalArray[i + 1] : 1;
          const nz = normalArray ? normalArray[i + 2] : 0;

          // Idle subtle jelly breathing
          const breathe = Math.sin(time * 3.0 + mesh.position.x * 2.0 + origPos[i]) * 0.025;

          // Pointer impact
          if (isHit) {
            const vx = posArray[i] - hitLocalPoint.x;
            const vy = posArray[i + 1] - hitLocalPoint.y;
            const vz = posArray[i + 2] - hitLocalPoint.z;
            const dist = Math.sqrt(vx * vx + vy * vy + vz * vz);

            if (dist < pushRadius && dist > 0.001) {
              const factor = (1 - dist / pushRadius) * pushForce;
              velocity[i] += nx * factor * 0.12;
              velocity[i + 1] += ny * factor * 0.12;
              velocity[i + 2] += nz * factor * 0.12;
            }
          }

          // Restoring spring physics toward original vertex
          const targetX = origPos[i] + nx * breathe;
          const targetY = origPos[i + 1] + ny * breathe;
          const targetZ = origPos[i + 2] + nz * breathe;

          const fx = (targetX - posArray[i]) * stiffness;
          const fy = (targetY - posArray[i + 1]) * stiffness;
          const fz = (targetZ - posArray[i + 2]) * stiffness;

          velocity[i] = (velocity[i] + fx) * damping;
          velocity[i + 1] = (velocity[i + 1] + fy) * damping;
          velocity[i + 2] = (velocity[i + 2] + fz) * damping;

          // Clamp max velocity
          velocity[i] = Math.max(-0.05, Math.min(0.05, velocity[i]));
          velocity[i + 1] = Math.max(-0.05, Math.min(0.05, velocity[i + 1]));
          velocity[i + 2] = Math.max(-0.05, Math.min(0.05, velocity[i + 2]));

          posArray[i] += velocity[i];
          posArray[i + 1] += velocity[i + 1];
          posArray[i + 2] += velocity[i + 2];
        }

        posAttr.needsUpdate = true;
        geo.computeVertexNormals();

        // Independent gentle float per mesh
        mesh.rotation.z = Math.sin(time * 1.5 + mesh.position.x) * 0.04;
      });

      // Overall group tilt
      letterGroup.rotation.y = Math.sin(time * 0.5) * 0.12;
      letterGroup.rotation.x = Math.cos(time * 0.4) * 0.06;

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
      if (interactive) window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [text, colorHex, accentHex, interactive]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', pointerEvents: 'auto' }} />;
};
