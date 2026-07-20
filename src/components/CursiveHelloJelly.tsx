import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CursiveHelloJelly: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    el.appendChild(renderer.domElement);

    // Procedural Sky Environment for crisp ice-blue glass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xdbeeff); // Soft bright ice blue

    const envLight1 = new THREE.DirectionalLight(0xffffff, 5);
    envLight1.position.set(8, 12, 8);
    envScene.add(envLight1);

    const envLight2 = new THREE.DirectionalLight(0x38bdf8, 4);
    envLight2.position.set(-8, -6, -6);
    envScene.add(envLight2);

    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;

    // Lighting
    const ambLight = new THREE.AmbientLight(0xf0f7ff, 2.2);
    scene.add(ambLight);

    const sun = new THREE.DirectionalLight(0xffffff, 4.5);
    sun.position.set(10, 14, 10);
    scene.add(sun);

    const skyLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    skyLight.position.set(-10, -8, 6);
    scene.add(skyLight);

    const pinkReflect = new THREE.PointLight(0xff69b4, 3.0, 25);
    pinkReflect.position.set(4, -4, 6);
    scene.add(pinkReflect);

    // Ultra-clear Ice Blue Jelly Glass Material
    const jellyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x38bdf8),       // Ice Sky Blue
      transmission: 0.95,                      // High transparency glass
      opacity: 0.98,
      transparent: true,
      roughness: 0.02,
      metalness: 0.05,
      ior: 1.42,
      thickness: 1.8,
      specularIntensity: 2.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      attenuationColor: new THREE.Color(0x0066ff),
      attenuationDistance: 4.0,
    });

    // Elegant Cursive "hello" 3D Spline Points (Wider horizontal spacing)
    const helloControlPoints = [
      // 'h'
      new THREE.Vector3(-9.0, -1.8, 0),
      new THREE.Vector3(-8.2, 1.2, 0.2),
      new THREE.Vector3(-7.2, 3.2, 0.4),
      new THREE.Vector3(-6.4, 2.2, 0.2),
      new THREE.Vector3(-6.8, -1.5, 0),
      new THREE.Vector3(-6.5, -0.2, 0.2),
      new THREE.Vector3(-5.4, 1.2, 0.3),
      new THREE.Vector3(-4.5, -1.0, 0.1),

      // 'e'
      new THREE.Vector3(-3.4, -0.6, 0.2),
      new THREE.Vector3(-2.8, 0.8, 0.4),
      new THREE.Vector3(-3.6, 0.5, 0.2),
      new THREE.Vector3(-3.0, -1.4, 0),
      new THREE.Vector3(-2.0, -1.2, 0.1),

      // 'l' (first)
      new THREE.Vector3(-1.0, 0.6, 0.3),
      new THREE.Vector3(-0.2, 3.4, 0.5),
      new THREE.Vector3(0.5, 2.4, 0.3),
      new THREE.Vector3(0.0, -1.4, 0),

      // 'l' (second)
      new THREE.Vector3(0.8, 0.6, 0.3),
      new THREE.Vector3(1.6, 3.4, 0.5),
      new THREE.Vector3(2.3, 2.4, 0.3),
      new THREE.Vector3(1.8, -1.3, 0),

      // 'o'
      new THREE.Vector3(2.8, -0.6, 0.2),
      new THREE.Vector3(3.6, 1.0, 0.4),
      new THREE.Vector3(5.0, 0.6, 0.3),
      new THREE.Vector3(4.6, -1.3, 0.1),
      new THREE.Vector3(3.2, -1.1, 0.2),
      new THREE.Vector3(3.5, 0.5, 0.4),
      new THREE.Vector3(5.2, 0.8, 0.4),
      new THREE.Vector3(7.5, -0.2, 0.2),
      new THREE.Vector3(9.2, -0.6, 0),
    ];

    const splineCurve = new THREE.CatmullRomCurve3(helloControlPoints, false, 'centripetal', 0.5);

    // Slimmer Tube Radius (0.35 instead of 0.82) to prevent overlapping clumping
    const tubeGeometry = new THREE.TubeGeometry(splineCurve, 260, 0.35, 32, false);
    const posAttr = tubeGeometry.attributes.position;
    const origPos = new Float32Array(posAttr.array);
    const velocity = new Float32Array(posAttr.array.length);

    const mesh = new THREE.Mesh(tubeGeometry, jellyMaterial);
    scene.add(mesh);

    // Pointer Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let mouseSpeed = 0;
    let prevMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      const posArray = posAttr.array as Float32Array;
      const normalArray = tubeGeometry.attributes.normal.array as Float32Array;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(mesh);
      let hitLocal: THREE.Vector3 | null = null;

      if (intersects.length > 0) {
        hitLocal = intersects[0].point.clone();
        mesh.worldToLocal(hitLocal);
      }

      const pushRadius = 2.0;
      const pushForce = Math.min(mouseSpeed * 0.006 + 0.1, 0.3);
      const stiffness = 0.14;
      const damping = 0.85;

      for (let i = 0; i < posArray.length; i += 3) {
        const nx = normalArray[i];
        const ny = normalArray[i + 1];
        const nz = normalArray[i + 2];

        const wave = Math.sin(time * 2.5 + origPos[i] * 0.5) * 0.025;

        if (hitLocal) {
          const vx = posArray[i] - hitLocal.x;
          const vy = posArray[i + 1] - hitLocal.y;
          const vz = posArray[i + 2] - hitLocal.z;
          const dist = Math.sqrt(vx * vx + vy * vy + vz * vz);

          if (dist < pushRadius && dist > 0.001) {
            const factor = (1 - dist / pushRadius) * pushForce;
            velocity[i] += nx * factor * 0.15;
            velocity[i + 1] += ny * factor * 0.15;
            velocity[i + 2] += nz * factor * 0.15;
          }
        }

        const targetX = origPos[i] + nx * wave;
        const targetY = origPos[i + 1] + ny * wave;
        const targetZ = origPos[i + 2] + nz * wave;

        const fx = (targetX - posArray[i]) * stiffness;
        const fy = (targetY - posArray[i + 1]) * stiffness;
        const fz = (targetZ - posArray[i + 2]) * stiffness;

        velocity[i] = (velocity[i] + fx) * damping;
        velocity[i + 1] = (velocity[i + 1] + fy) * damping;
        velocity[i + 2] = (velocity[i + 2] + fz) * damping;

        velocity[i] = Math.max(-0.04, Math.min(0.04, velocity[i]));
        velocity[i + 1] = Math.max(-0.04, Math.min(0.04, velocity[i + 1]));
        velocity[i + 2] = Math.max(-0.04, Math.min(0.04, velocity[i + 2]));

        posArray[i] += velocity[i];
        posArray[i + 1] += velocity[i + 1];
        posArray[i + 2] += velocity[i + 2];
      }

      posAttr.needsUpdate = true;
      tubeGeometry.computeVertexNormals();

      // Soft tilt responsive to mouse
      mesh.rotation.y = mouse.x * 0.12 + Math.sin(time * 0.4) * 0.04;
      mesh.rotation.x = -mouse.y * 0.12 + Math.cos(time * 0.3) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

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
      pmremGenerator.dispose();
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
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 1,
      }}
    />
  );
};
