import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Flow AI Quantum Hero:
 * Luminous violet/cyan neural core ringed by gyroscopic energy orbits
 * and an interactive reactive particle cloud that tracks pointer momentum.
 */
export default function ThreeHero() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return;
    }
    const reduce = prefersReducedMotion();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 13.5);

    // Dynamic Multi-Spectrum Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(5, 6, 6);
    scene.add(key);

    const rimCyan = new THREE.PointLight(0x06b6d4, 55, 30);
    rimCyan.position.set(-6, -3, 4);
    scene.add(rimCyan);

    const glowViolet = new THREE.PointLight(0x8b5cf6, 75, 35);
    glowViolet.position.set(4, -5, 5);
    scene.add(glowViolet);

    const pulseCoral = new THREE.PointLight(0xf43f5e, 35, 25);
    pulseCoral.position.set(0, 5, -2);
    scene.add(pulseCoral);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Neural Crystal Core
    const coreGeo = new THREE.IcosahedronGeometry(1.8, 28);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x7138f5,
      roughness: 0.14,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.35,
      ior: 1.45,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xd8b4fe),
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    const basePositions = (core.geometry.attributes.position as THREE.BufferAttribute).array.slice() as Float32Array;
    group.add(core);

    // 2. Gyroscopic Energy Rings
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.25,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.045, 24, 240), ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    group.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.3,
      metalness: 0.6,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.038, 24, 240), ringMat2);
    ring2.rotation.set(Math.PI / 3.2, 0.6, 0);
    group.add(ring2);

    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.4,
      metalness: 0.7,
    });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.028, 20, 200), ringMat3);
    ring3.rotation.set(-Math.PI / 4, -0.4, 0);
    group.add(ring3);

    // 3. Orbiting Data Beads
    const beadGeo = new THREE.OctahedronGeometry(0.18, 0);
    const beads: { m: THREE.Mesh; r: number; s: number; o: number; t: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const isCyan = i % 3 === 0;
      const isCoral = i % 4 === 0;
      const col = isCyan ? 0x06b6d4 : isCoral ? 0xf43f5e : 0xffffff;
      const m = new THREE.Mesh(beadGeo, new THREE.MeshStandardMaterial({ color: col, roughness: 0.2, metalness: 0.5 }));
      const b = {
        m,
        r: 2.8 + (i % 4) * 0.36,
        s: 0.22 + (i % 5) * 0.06,
        o: (i / 18) * Math.PI * 2,
        t: (i % 6) * 0.3 - 0.75,
      };
      beads.push(b);
      group.add(m);
    }

    // 4. Flow AI Neural Particle Matrix
    const particleCount = 380;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleData: { radius: number; theta: number; phi: number; speed: number; yOsc: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleData.push({
        radius,
        theta,
        phi,
        speed: 0.15 + Math.random() * 0.35,
        yOsc: (Math.random() - 0.5) * 0.15,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.075,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    group.add(particleCloud);

    // Resize handling
    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 440 ? 17 : 13.5;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Smooth Cursor Physics Tracking
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
    }, { threshold: 0.01 });
    io.observe(el);

    const pos = core.geometry.attributes.position as THREE.BufferAttribute;
    const partPos = particleCloud.geometry.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible && !reduce) return;
      const t = clock.getElapsedTime();

      if (!reduce) {
        // Organic neural core pulse
        for (let i = 0; i < pos.count; i++) {
          v.set(basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]);
          const n = Math.sin(v.x * 1.8 + t * 1.4) * Math.cos(v.y * 1.5 + t * 1.2) * 0.08 + Math.sin(v.z * 2.2 + t * 1.8) * 0.04;
          v.normalize().multiplyScalar(1.8 + n + Math.max(0, Math.sin(t * 2.4)) * 0.04);
          pos.setXYZ(i, v.x, v.y, v.z);
        }
        pos.needsUpdate = true;
        core.geometry.computeVertexNormals();

        // Orbiting particles
        const pArr = partPos.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const p = particleData[i];
          const curTheta = p.theta + t * p.speed * 0.3;
          const r = p.radius + Math.sin(t * 1.5 + i) * 0.12;
          pArr[i * 3] = r * Math.sin(p.phi) * Math.cos(curTheta);
          pArr[i * 3 + 1] = r * Math.sin(p.phi) * Math.sin(curTheta) + Math.sin(t + i) * 0.08;
          pArr[i * 3 + 2] = r * Math.cos(p.phi);
        }
        partPos.needsUpdate = true;

        // Counter-rotating orbital rings
        ring1.rotation.z = t * 0.28;
        ring2.rotation.z = -t * 0.22;
        ring3.rotation.y = t * 0.16;

        // Beads orbit
        beads.forEach((b) => {
          const a = b.o + t * b.s;
          b.m.position.set(Math.cos(a) * b.r, b.t + Math.sin(a * 1.6) * 0.3, Math.sin(a) * b.r);
          b.m.rotation.x = t * 1.2;
          b.m.rotation.y = t;
        });

        // Smooth cursor interpolation
        current.x += (target.x * 0.65 - current.x) * 0.06;
        current.y += (target.y * 0.45 - current.y) * 0.06;
        group.rotation.y = current.x;
        group.rotation.x = -current.y;
        group.position.y = Math.sin(t * 1.1) * 0.14;
      } else {
        beads.forEach((b) => b.m.position.set(Math.cos(b.o) * b.r, b.t, Math.sin(b.o) * b.r));
        group.rotation.set(0.25, -0.35, 0);
      }

      renderer.render(scene, camera);
      if (reduce) {
        cancelAnimationFrame(raf);
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    return (
      <div
        aria-hidden
        className="mx-auto aspect-square w-3/4 rounded-full bg-[radial-gradient(circle_at_30%_30%,#c4b5fd,#7138F5_55%,#0f172a)] shadow-lift"
      />
    );
  }
  return <div ref={host} className="h-full w-full [&>canvas]:h-full [&>canvas]:w-full" />;
}
