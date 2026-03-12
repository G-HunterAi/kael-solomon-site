"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
//  CONSTANTS (from tetraskelion.html reference)
// ─────────────────────────────────────────────────────────────────────────────
const SCALE = 2.2;
const NARROW = 0.52;
const BUILD_MS = 8000;
const BURST_AT_MS = BUILD_MS;
const BASE_SPEED = 0.004;
const PEAK_SPEED = 0.028;
const SETTLE_SPEED = 0.003;
const SELF_SPIN = 0.009;

// Sunburst color palette
const C = {
  deepAmber: 0x7a1800,
  amber: 0xc04010,
  warmGold: 0xe87010,
  brightGold: 0xffaa00,
  paleGold: 0xffdd44,
  solar: 0xfffaa0,
  white: 0xffffff,
};

// ─────────────────────────────────────────────────────────────────────────────
//  LEMNISCATE MATH
// ─────────────────────────────────────────────────────────────────────────────
function lemPoint(t: number) {
  const d = 1 + Math.sin(t) * Math.sin(t);
  return {
    x: (SCALE * Math.cos(t)) / d,
    r: (SCALE * NARROW * Math.sin(t) * Math.cos(t)) / d,
  };
}

function lemPos(t: number): THREE.Vector3 {
  const { x, r } = lemPoint(t);
  return new THREE.Vector3(x, r, 0); // XY plane (local)
}

// ─────────────────────────────────────────────────────────────────────────────
//  LEMNISCOID SURFACE GEOMETRY
// ─────────────────────────────────────────────────────────────────────────────
function buildLemniscoidGeo(tSegs = 160, phiSegs = 52): THREE.BufferGeometry {
  const verts: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= tSegs; i++) {
    const { x, r } = lemPoint((i / tSegs) * Math.PI * 2);
    const rad = Math.abs(r);
    for (let j = 0; j <= phiSegs; j++) {
      const phi = (j / phiSegs) * Math.PI * 2;
      verts.push(x, rad * Math.cos(phi), rad * Math.sin(phi));
    }
  }
  for (let i = 0; i < tSegs; i++) {
    for (let j = 0; j < phiSegs; j++) {
      const a = i * (phiSegs + 1) + j;
      const b = a + phiSegs + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ─────────────────────────────────────────────────────────────────────────────
//  EASING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
function easeInQuad(t: number) {
  return t * t;
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ─────────────────────────────────────────────────────────────────────────────
//  ELECTRON STATE
// ─────────────────────────────────────────────────────────────────────────────
interface ElectronEntry {
  dot: THREE.Group;
  phase: number;
  speed: number;
}

interface TetraskelionCanvasProps {
  /** Callback when headline should appear (t=11s) */
  onHeadlineReady?: () => void;
}

export default function TetraskelionCanvas({
  onHeadlineReady,
}: TetraskelionCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onHeadlineReadyRef = useRef(onHeadlineReady);
  onHeadlineReadyRef.current = onHeadlineReady;

  const setup = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── SCENE SETUP ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.01,
      500
    );
    camera.position.set(4.5, 3.2, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // ── LIGHTING ────────────────────────────────────────────────────────────
    const centerLight = new THREE.PointLight(0xffeedd, 3.0, 28, 1.5);
    scene.add(centerLight);
    const rimLight = new THREE.DirectionalLight(0xccddff, 0.6);
    rimLight.position.set(-5, 8, -4);
    scene.add(rimLight);
    const ambientLight = new THREE.AmbientLight(0x080502, 1.0);
    scene.add(ambientLight);

    // ── LEMNISCOID GEOMETRY (shared) ────────────────────────────────────────
    const lGeo = buildLemniscoidGeo();

    function makeLemniscoid(
      rotX = 0,
      rotY = 0,
      rotZ = 0
    ): THREE.Group {
      const grp = new THREE.Group();
      // Glass surface
      grp.add(
        new THREE.Mesh(
          lGeo,
          new THREE.MeshPhongMaterial({
            color: 0x99bbdd,
            emissive: 0x030204,
            specular: 0xffffff,
            shininess: 90,
            transparent: true,
            opacity: 0.14,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        )
      );
      // Wireframe overlay
      grp.add(
        new THREE.Mesh(
          lGeo,
          new THREE.MeshBasicMaterial({
            color: C.warmGold,
            wireframe: true,
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      grp.rotation.set(rotX, rotY, rotZ);
      return grp;
    }

    const L1 = makeLemniscoid(); // X axis
    const L2 = makeLemniscoid(0, 0, Math.PI / 2); // Y axis
    const L3 = makeLemniscoid(0, -Math.PI / 2, 0); // Z axis

    // ── ELECTRONS ───────────────────────────────────────────────────────────
    function makeElectronDot(): THREE.Group {
      const g = new THREE.Group();
      [
        { r: 0.07, c: C.white, op: 1.0 },
        { r: 0.14, c: C.solar, op: 0.7 },
        { r: 0.26, c: C.paleGold, op: 0.3 },
      ].forEach(({ r, c, op }) =>
        g.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(r, 8, 8),
            new THREE.MeshBasicMaterial({
              color: c,
              transparent: true,
              opacity: op,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          )
        )
      );
      g.userData.isBand = true;
      return g;
    }

    const electronState: ElectronEntry[] = [];

    function addElectron(
      lemniscoidGrp: THREE.Group,
      startPhase: number,
      speed: number
    ) {
      const dot = makeElectronDot();
      lemniscoidGrp.add(dot);
      electronState.push({ dot, phase: startPhase, speed });
    }

    addElectron(L1, Math.PI * 0.25, 1.4);
    addElectron(L2, Math.PI * 0.25, 1.8);
    addElectron(L3, Math.PI * 0.25, 1.6);

    // ── PER-LEMNISCOID TUBES ────────────────────────────────────────────────
    function makeLocalTube(): THREE.Mesh {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 300; i++)
        pts.push(lemPos((i / 300) * Math.PI * 2));
      const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 400, 0.014, 6, true),
        new THREE.MeshBasicMaterial({
          color: C.brightGold,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      mesh.userData.isTube = true;
      return mesh;
    }

    const L1tube = makeLocalTube();
    L1.add(L1tube);
    const L2tube = makeLocalTube();
    L2.add(L2tube);
    const L3tube = makeLocalTube();
    L3.add(L3tube);

    // ── CENTER GLOW ─────────────────────────────────────────────────────────
    const centerGrp = new THREE.Group();
    const centerMats: THREE.MeshBasicMaterial[] = [];
    [
      { r: 0.035, c: C.white, op: 1.0 },
      { r: 0.09, c: C.solar, op: 0.8 },
      { r: 0.2, c: C.paleGold, op: 0.5 },
      { r: 0.4, c: C.warmGold, op: 0.25 },
      { r: 0.8, c: C.amber, op: 0.1 },
      { r: 1.6, c: C.deepAmber, op: 0.04 },
    ].forEach(({ r, c, op }) => {
      const mat = new THREE.MeshBasicMaterial({
        color: c,
        transparent: true,
        opacity: op,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      centerMats.push(mat);
      centerGrp.add(new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), mat));
    });

    // Anticipation glow
    const anticipationMat = new THREE.MeshBasicMaterial({
      color: C.white,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    centerGrp.add(
      new THREE.Mesh(new THREE.SphereGeometry(2.5, 20, 20), anticipationMat)
    );

    // ── BURST SYSTEM ────────────────────────────────────────────────────────
    const burstCoreMat = new THREE.MeshBasicMaterial({
      color: C.white,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const burstCore = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      burstCoreMat
    );

    const burstWaveMat = new THREE.MeshBasicMaterial({
      color: C.warmGold,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const burstWave = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      burstWaveMat
    );

    const burstAmbientMat = new THREE.MeshBasicMaterial({
      color: C.amber,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const burstAmbient = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 20),
      burstAmbientMat
    );

    const bgFloodMat = new THREE.MeshBasicMaterial({
      color: C.deepAmber,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const bgFlood = new THREE.Mesh(
      new THREE.SphereGeometry(60, 20, 20),
      bgFloodMat
    );
    scene.add(bgFlood);

    // ── STARFIELD ───────────────────────────────────────────────────────────
    const starVerts: number[] = [];
    for (let i = 0; i < 2500; i++) {
      const r = 80 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starVerts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVerts, 3)
    );
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0x332211,
          size: 0.1,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        })
      )
    );

    // ── MASTER GROUP ────────────────────────────────────────────────────────
    const masterGrp = new THREE.Group();
    masterGrp.add(L1, L2, L3);
    masterGrp.add(centerGrp, burstCore, burstWave, burstAmbient);
    scene.add(masterGrp);

    // ── CURSOR TRACKING ─────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── ANIMATION STATE ─────────────────────────────────────────────────────
    const startTime = Date.now();
    let burstFired = false;
    let burstTime = 0;
    let currentSpeed = BASE_SPEED;
    let masterRotY = 0;
    let sceneOpacity = 0;
    let headlineShown = false;
    let animFrameId = 0;

    const spinVec = new THREE.Vector3(1, 0, 0);
    const centerBaseOpacities = [1.0, 0.8, 0.5, 0.25, 0.1, 0.04];

    // ── ANIMATE LOOP ────────────────────────────────────────────────────────
    function animate() {
      animFrameId = requestAnimationFrame(animate);

      const now = Date.now();
      const elapsed = now - startTime;
      const elapsedS = elapsed / 1000;
      const buildT = clamp(elapsed / BUILD_MS, 0, 1);

      // Scene opacity fade-in (first 1.5s)
      sceneOpacity = clamp(elapsed / 1500, 0, 1);

      // Rotation speed build
      if (!burstFired) {
        currentSpeed = lerp(BASE_SPEED, PEAK_SPEED, easeInQuad(buildT));
      } else {
        const settleT = clamp(burstTime / 1.5, 0, 1);
        currentSpeed = lerp(PEAK_SPEED, SETTLE_SPEED, easeOutCubic(settleT));
      }

      masterRotY += currentSpeed;

      // Cursor influence
      const targetRotX = mouseY * -0.15;
      masterGrp.rotation.x +=
        (targetRotX - masterGrp.rotation.x) * 0.03;
      masterGrp.rotation.y = masterRotY + mouseX * 0.12;

      // Self-axis spin
      const selfSpd = burstFired
        ? lerp(SELF_SPIN, SELF_SPIN * 0.4, clamp(burstTime / 3, 0, 1))
        : SELF_SPIN;
      L1.rotateOnAxis(spinVec, selfSpd);
      L2.rotateOnAxis(spinVec, selfSpd * 0.78);
      L3.rotateOnAxis(spinVec, selfSpd * 1.22);

      // Moving electrons
      electronState.forEach((e) => {
        e.phase += e.speed * 0.016;
        const { x, r } = lemPoint(e.phase);
        e.dot.position.set(x, r, 0);
      });

      // Center pulse
      const beat = (Math.sin(elapsedS * 4) + 1) / 2;
      centerGrp.scale.setScalar((1 + beat * 0.12) * sceneOpacity);
      centerMats.forEach((mat, i) => {
        mat.opacity = centerBaseOpacities[i] * sceneOpacity;
      });

      // Anticipation glow (t=7-8s)
      if (!burstFired && elapsed > 7000) {
        const anticipateT = (elapsed - 7000) / 1000;
        anticipationMat.opacity = clamp(anticipateT * 0.5, 0, 0.5);
      }

      // Burst trigger
      if (!burstFired && elapsed >= BURST_AT_MS) {
        burstFired = true;
        burstTime = 0;
        anticipationMat.opacity = 0;
      }

      // Burst animation
      if (burstFired) {
        burstTime += 1 / 60;

        // Stage 1: Core detonation
        if (burstTime <= 0.7) {
          const t = burstTime / 0.7;
          burstCore.scale.setScalar(0.05 + easeOutCubic(t) * 3.45);
          burstCoreMat.opacity = Math.max(0, 1.5 * (1 - t * t * t));
        } else {
          burstCoreMat.opacity = 0;
        }

        // Stage 2: Primary shockwave
        if (burstTime <= 4.0) {
          const t = burstTime / 4.0;
          const radius = 0.1 + easeOutQuart(t) * 22;
          burstWave.scale.setScalar(radius);
          const peak = Math.min(burstTime / 0.3, 1);
          const decay = Math.max(
            0,
            1 - easeOutCubic(Math.max(0, burstTime - 0.3) / 3.7)
          );
          burstWaveMat.opacity = peak * decay * 0.75;
        } else {
          burstWaveMat.opacity = 0;
        }

        // Stage 3: Outer ambient cloud
        if (burstTime <= 5.5) {
          const t = burstTime / 5.5;
          burstAmbient.scale.setScalar(0.5 + easeOutCubic(t) * 30);
          burstAmbientMat.opacity = Math.max(
            0,
            0.3 * (1 - easeOutCubic(t))
          );
        } else {
          burstAmbientMat.opacity = 0;
        }

        // Background warm flood
        if (burstTime < 5.0) {
          const peak = Math.min(burstTime / 0.4, 1);
          const decay = Math.max(
            0,
            1 - easeOutCubic(Math.max(0, burstTime - 0.4) / 4.6)
          );
          bgFloodMat.opacity = peak * decay * 0.35;
        } else {
          bgFloodMat.opacity = 0;
        }
      }

      // Scene fade-in for lemniscoid materials
      [L1, L2, L3].forEach((l) =>
        l.children.forEach((m) => {
          if (!(m instanceof THREE.Mesh) || !m.material) return;
          if (m.userData.isBand || m.userData.isTube) return;
          const mat = m.material as THREE.Material & {
            wireframe?: boolean;
            opacity: number;
          };
          if (mat.wireframe) {
            mat.opacity = 0.18 * sceneOpacity;
          } else {
            mat.opacity = 0.14 * sceneOpacity;
          }
        })
      );

      // Fade tubes
      [L1tube, L2tube, L3tube].forEach((t) => {
        const mat = t.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = 0.85 * sceneOpacity;
      });

      // Fade electron dots
      electronState.forEach((e) => {
        const opacities = [1.0, 0.7, 0.3];
        e.dot.children.forEach((m, i) => {
          if (m instanceof THREE.Mesh && m.material) {
            (m.material as THREE.MeshBasicMaterial).opacity =
              opacities[i] * sceneOpacity;
          }
        });
      });

      // Headline reveal (t=11s)
      if (!headlineShown && elapsed > 11000) {
        headlineShown = true;
        onHeadlineReadyRef.current?.();
      }

      renderer.render(scene, camera);
    }

    // ── RESIZE ──────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── START ───────────────────────────────────────────────────────────────
    animate();

    // ── CLEANUP ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose ALL geometries and materials in the scene
      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = setup();
    return cleanup;
  }, [setup]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
}
