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
const SELF_SPIN = 0.028;

// Fire blue color palette
const C = {
  deepAmber: 0x000b44,
  amber: 0x0a2e9e,
  warmGold: 0x1e5cff,
  brightGold: 0x4de8ff,
  paleGold: 0x6eb4ff,
  solar: 0x6eb4ff,
  white: 0x9dc8ff,
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
function buildLemniscoidGeo(tSegs = 40, phiSegs = 12): THREE.BufferGeometry {
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
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const centerLight = new THREE.PointLight(0x1e5cff, 1.8, 20, 2.0);
    scene.add(centerLight);
    const rimLight = new THREE.DirectionalLight(0xbbddff, 0.9);
    rimLight.position.set(-5, 8, -4);
    scene.add(rimLight);
    const ambientLight = new THREE.AmbientLight(0x020408, 1.0);
    scene.add(ambientLight);

    // ── LEMNISCOID GEOMETRY (shared) ────────────────────────────────────────
    const lGeo = buildLemniscoidGeo();

    function makeLemniscoid(
      rotX = 0,
      rotY = 0,
      rotZ = 0
    ): THREE.Group {
      const grp = new THREE.Group();
      // Glass surface — fire blue glass
      grp.add(
        new THREE.Mesh(
          lGeo,
          new THREE.MeshPhongMaterial({
            color: 0x0a1eaa,
            emissive: 0x071266,
            specular: 0x4488ff,
            shininess: 140,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.NormalBlending,
          })
        )
      );
      // Wireframe overlay — fire blue, NormalBlending
      grp.add(
        new THREE.Mesh(
          lGeo,
          new THREE.MeshBasicMaterial({
            color: 0x1e5cff,
            wireframe: true,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            blending: THREE.NormalBlending,
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
        { r: 0.07, c: 0x4488ff, op: 0.0 },
        { r: 0.14, c: 0x4499ff, op: 0.0 },
        { r: 0.26, c: 0x1e5cff, op: 0.0 },
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
      { r: 0.035, c: C.solar, op: 0.0 },
      { r: 0.09, c: C.solar, op: 0.0 },
      { r: 0.2, c: C.paleGold, op: 0.0 },
      { r: 0.4, c: C.warmGold, op: 0.0 },
      { r: 0.8, c: C.amber, op: 0.0 },
      { r: 1.6, c: C.deepAmber, op: 0.0 },
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
      color: 0x4488ff,
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
      color: 0x4488ff,
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
      color: 0x2266ff,
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
      color: 0x001166,
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

    // ── VIDEO UNLOCK ON FIRST CLICK ─────────────────────────────────────────
    let vidUnlocked = false;
    let vidPending = false;
    const handleClick = () => {
      vidUnlocked = true;
      if (vidPending && videoRef.current) {
        vidPending = false;
        videoRef.current.play();
      }
    };
    window.addEventListener("click", handleClick);

    // ── ANIMATION STATE ─────────────────────────────────────────────────────
    const startTime = Date.now();
    let burstFired = false;
    let burstTime = 0;
    let shakeActive = 0;
    let currentSpeed = BASE_SPEED;
    let masterRotY = 0;
    let sceneOpacity = 0;
    let headlineShown = false;
    let animFrameId = 0;

    const spinVec = new THREE.Vector3(1, 0, 0);

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
      // All center disc halos killed
      centerMats.forEach((mat) => {
        mat.opacity = 0;
      });

      // Anticipation glow (t=7-8s) — disabled
      if (!burstFired && elapsed > 7000) {
        anticipationMat.opacity = 0;
      }

      // Burst trigger
      if (!burstFired && elapsed >= BURST_AT_MS) {
        burstFired = true;
        burstTime = 0;
        shakeActive = 0.38;
        anticipationMat.opacity = 0;

        // Fire video overlay
        const vid = videoRef.current;
        if (vid) {
          vid.currentTime = 0;
          vid.style.opacity = "1";
          const p = vid.play();
          if (p) p.catch(() => { vidPending = true; });
          vid.onended = () => { vid.style.opacity = "0"; };
        }
      }

      // Burst animation — all Three.js effects killed, video handles it
      if (burstFired) {
        burstTime += 1 / 60;

        // Stage 1: Core detonation — disabled
        if (burstTime <= 0.7) {
          const t = burstTime / 0.7;
          burstCore.scale.setScalar(0.05 + easeOutCubic(t) * 3.45);
          burstCoreMat.opacity = 0;
        } else {
          burstCoreMat.opacity = 0;
        }

        // Stage 2: Primary shockwave — disabled
        if (burstTime <= 4.0) {
          const t = burstTime / 4.0;
          const radius = 0.1 + easeOutQuart(t) * 22;
          burstWave.scale.setScalar(radius);
          burstWaveMat.opacity = 0;
        } else {
          burstWaveMat.opacity = 0;
        }

        // Stage 3: Outer ambient cloud — disabled
        if (burstTime <= 5.5) {
          const t = burstTime / 5.5;
          burstAmbient.scale.setScalar(0.5 + easeOutCubic(t) * 30);
          burstAmbientMat.opacity = 0;
        } else {
          burstAmbientMat.opacity = 0;
        }

        // Background warm flood — disabled
        bgFloodMat.opacity = 0;

        // Light spike — subtle pulse, not flash
        if (burstTime < 0.12) {
          centerLight.intensity = 2.5;
          centerLight.color.setHex(0x1e5cff);
        } else if (burstTime < 3.0) {
          const flashDecay = clamp(burstTime / 0.25, 0, 1);
          centerLight.intensity = flashDecay < 1
            ? lerp(2.5, 1.8, easeOutCubic(flashDecay))
            : lerp(1.8, 1.8, easeOutCubic(clamp((burstTime - 0.25) / 4.0, 0, 1)));
        }
      }

      // Camera shake
      if (shakeActive > 0) {
        shakeActive -= 1 / 60;
        const intensity = (shakeActive / 0.38) * 0.22;
        camera.position.x = 4.5 + (Math.random() - 0.5) * 2 * intensity;
        camera.position.y = 3.2 + (Math.random() - 0.5) * 2 * intensity;
      } else if (burstFired && shakeActive <= 0) {
        camera.position.x = 4.5;
        camera.position.y = 3.2;
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
            mat.opacity = 0.32 * sceneOpacity;
          } else {
            mat.opacity = 0.12 * sceneOpacity;
          }
        })
      );

      // Fade tubes
      [L1tube, L2tube].forEach((t) => {
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
      window.removeEventListener("click", handleClick);

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
    <>
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
      <video
        ref={videoRef}
        src="/explosion.mp4"
        preload="auto"
        playsInline
        muted
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "140%",
          minWidth: "140%",
          mixBlendMode: "screen",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.15s",
          zIndex: 2,
        }}
      />
    </>
  );
}
