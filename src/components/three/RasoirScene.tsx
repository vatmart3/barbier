"use client";

/**
 * Rasoir coupe-chou 3D, 100 % procédural (aucun modèle à télécharger).
 * - Lame : ExtrudeGeometry biseautée, acier poli (MeshPhysicalMaterial métal).
 * - Manche : deux plaquettes de corne sombre (texture de veinage générée en canvas).
 * - Reflets : environnement fait de Lightformers (pas de HDR distante).
 * Le scroll (heroState.p) ouvre la lame et fait pivoter l'objet, comme une page produit.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/components/home/heroState";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function useBladeGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.92, 0.07);
    s.lineTo(0.3, 0.12);
    s.lineTo(2.86, 0.12);
    s.quadraticCurveTo(3.14, 0.1, 3.12, -0.2);
    s.quadraticCurveTo(3.08, -0.5, 2.8, -0.55);
    s.quadraticCurveTo(1.6, -0.63, 0.46, -0.47);
    s.quadraticCurveTo(0.26, -0.37, 0.22, -0.14);
    s.lineTo(-0.1, -0.1);
    s.lineTo(-0.92, -0.05);
    s.quadraticCurveTo(-1.08, 0.01, -0.92, 0.07);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.016,
      bevelSegments: 3,
      curveSegments: 24,
    });
    g.translate(0, 0, -0.015);
    g.computeVertexNormals();
    return g;
  }, []);
}

function useScaleGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.34, 0.2);
    s.bezierCurveTo(-0.62, 0.16, -0.62, -0.4, -0.3, -0.44);
    s.lineTo(3.12, -0.54);
    s.bezierCurveTo(3.5, -0.54, 3.52, 0.2, 3.14, 0.22);
    s.lineTo(-0.34, 0.2);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 32,
    });
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Veinage de corne : fond brun-noir + stries ambrées translucides */
function makeHornTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0f0b09";
  ctx.fillRect(0, 0, 512, 128);
  let seed = 11;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) {
    const y = r() * 128;
    ctx.strokeStyle = `rgba(${120 + r() * 60}, ${70 + r() * 40}, ${30 + r() * 20}, ${0.05 + r() * 0.12})`;
    ctx.lineWidth = 0.5 + r() * 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + (r() - 0.5) * 30, 340, y + (r() - 0.5) * 30, 512, y + (r() - 0.5) * 20);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.3, 1.2);
  return t;
}

/** Gravure « DÉGRADÉ · SÈTE » sur le plat de la lame */
function makeEtchTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 128);
  ctx.fillStyle = "rgba(20,20,20,0.75)";
  ctx.font = "600 44px 'Schibsted Grotesk', sans-serif";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "14px";
  ctx.fillText("DÉGRADÉ · SÈTE · 34200", 20, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Rasoir({ onReady }: { onReady?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const blade = useRef<THREE.Group>(null);
  const smooth = useRef({ p: 0, rx: 0, ry: 0 });
  const readySent = useRef(false);
  const { viewport, invalidate } = useThree();

  const bladeGeo = useBladeGeometry();
  const scaleGeo = useScaleGeometry();
  const pinGeo = useMemo(() => new THREE.CylinderGeometry(0.055, 0.055, 0.26, 20), []);
  const etchGeo = useMemo(() => new THREE.PlaneGeometry(1.7, 0.21), []);

  const mats = useMemo(() => {
    const steel = new THREE.MeshPhysicalMaterial({
      color: "#e4e7ea",
      metalness: 1,
      roughness: 0.18,
      clearcoat: 0.35,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.35,
    });
    const horn = new THREE.MeshPhysicalMaterial({
      map: makeHornTexture(),
      roughness: 0.34,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      envMapIntensity: 0.9,
    });
    const nickel = new THREE.MeshStandardMaterial({ color: "#cfd3d6", metalness: 1, roughness: 0.22 });
    const etch = new THREE.MeshBasicMaterial({ map: makeEtchTexture(), transparent: true, depthWrite: false, opacity: 0.55 });
    return { steel, horn, nickel, etch };
  }, []);

  useEffect(
    () => () => {
      bladeGeo.dispose();
      scaleGeo.dispose();
      pinGeo.dispose();
      etchGeo.dispose();
      mats.horn.map?.dispose();
      mats.etch.map?.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [bladeGeo, scaleGeo, pinGeo, etchGeo, mats],
  );

  useFrame((state, delta) => {
    const g = group.current;
    const b = blade.current;
    if (!g || !b) return;
    const k = 1 - Math.pow(0.001, delta); // lissage indépendant du framerate
    const sm = smooth.current;
    sm.p += (heroState.p - sm.p) * Math.min(1, k * 2.2);
    sm.rx += (-heroState.py * 0.28 - sm.rx) * k * 0.8;
    sm.ry += (heroState.px * 0.42 - sm.ry) * k * 0.8;
    const p = sm.p;
    const t = state.clock.elapsedTime;

    const w = viewport.width;
    const h = viewport.height;
    const portrait = w < h;
    // Présentation « produit » : centré sous le titre, puis au centre de l'écran
    const lever = easeInOut(range(p, 0, 0.6));
    const base = portrait ? w * 0.13 : Math.min(w * 0.068, h * 0.1);
    g.scale.setScalar(base * THREE.MathUtils.lerp(1, 1.3, lever));

    // 1. Ouverture de la lame (0 → 0.55)
    const open = easeInOut(range(p, 0, 0.55));
    b.rotation.z = THREE.MathUtils.lerp(2.55, Math.PI * 1.03, open);

    // 2. L'objet monte au centre, se redresse à l'horizontale et pivote lentement
    const yRepos = portrait ? -0.14 * h : -0.17 * h;
    g.position.set(0, THREE.MathUtils.lerp(yRepos, 0, lever) + Math.sin(t * 1.1) * 0.03 * base, 0);
    const tour = easeInOut(range(p, 0.3, 1));
    g.rotation.set(
      THREE.MathUtils.lerp(0.4, 0.12, lever) + sm.rx * 0.6 + Math.sin(t * 0.7) * 0.03,
      THREE.MathUtils.lerp(-0.5, 0.35, tour) + sm.ry * 0.6,
      THREE.MathUtils.lerp(0.3, 0.02, open) + Math.sin(t * 0.5) * 0.02,
    );

    if (!readySent.current) {
      readySent.current = true;
      onReady?.();
    }
    if (state.frameloop === "demand") invalidate();
  });

  return (
    <group ref={group}>
      {/* Manche : deux plaquettes, lame entre les deux */}
      <mesh geometry={scaleGeo} material={mats.horn} position={[0, 0, 0.045]} />
      <mesh geometry={scaleGeo} material={mats.horn} position={[0, 0, -0.14]} />
      {/* Axe de pivot et goupille de queue */}
      <mesh geometry={pinGeo} material={mats.nickel} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={pinGeo} material={mats.nickel} rotation={[Math.PI / 2, 0, 0]} position={[3.18, -0.16, 0]} />
      {/* Lame (pivote autour de l'origine) */}
      <group ref={blade}>
        <mesh geometry={bladeGeo} material={mats.steel} />
        <mesh geometry={etchGeo} material={mats.etch} position={[1.55, -0.18, 0.032]} rotation={[0, 0, Math.PI]} />
      </group>
    </group>
  );
}

export default function RasoirScene({ active, onReady }: { active: boolean; onReady?: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#ffffff" />
      <Environment resolution={256} frames={1}>
        {/* Fond d'atelier gris : l'acier ne tombe jamais dans le noir */}
        <color attach="background" args={["#3a3a3a"]} />
        {/* Grande boîte à lumière derrière la caméra : c'est elle que l'acier reflète */}
        <Lightformer form="rect" intensity={1.4} position={[0, 2.5, 10]} scale={[16, 2, 1]} color="#e9e4da" />
        <Lightformer form="rect" intensity={2.2} position={[0, -1, 10]} scale={[16, 1, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.8} position={[0, -3.5, 9]} scale={[16, 2.5, 1]} color="#c3c8cc" />
        <Lightformer form="rect" intensity={5} position={[0, 4, 4]} rotation-x={Math.PI / 2.5} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 1.4, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 0.6, 1]} />
        <Lightformer form="ring" color="#f2ede4" intensity={2.5} position={[0, 0, -6]} scale={3} />
        <Lightformer form="rect" color="#ffffff" intensity={0.8} position={[0, -4, 1]} rotation-x={Math.PI / 2} scale={[6, 0.4, 1]} />
      </Environment>
      <Rasoir onReady={onReady} />
    </Canvas>
  );
}
