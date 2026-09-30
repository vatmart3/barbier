"use client";

/**
 * Tondeuse de barbier 3D, 100 % procédurale (aucun modèle à télécharger).
 * - Corps : LatheGeometry aplatie, laque noire vernie, bague et interrupteur or.
 * - Tête : lame fixe et lame mobile chromées, dents en InstancedMesh.
 * - Sabot : peigne de guidage en côtes noires translucides.
 * - Reflets : environnement fait de Lightformers (pas de HDR distante).
 * Le scroll (heroState.p) retire le sabot, allume la tondeuse (la lame mobile
 * vibre, le témoin s'éclaire) et fait pivoter l'objet pour montrer la denture.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/components/home/heroState";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Longueur du corps, de la queue (x = 0) à la tête */
const L = 4.1;
const DENTS = 24;
const COTES = 15;
const LARGEUR = 1.02;

/** Profil du corps (rayon, position) : queue arrondie, taille marquée, tête évasée */
function useCorpsGeometry() {
  return useMemo(() => {
    const pts = [
      [0, 0],
      [0.2, 0.02],
      [0.34, 0.08],
      [0.43, 0.22],
      [0.46, 0.45],
      [0.45, 1.2],
      [0.42, 1.8],
      [0.44, 2.4],
      [0.51, 3.1],
      [0.55, 3.6],
      [0.54, 3.9],
      [0.49, 4.05],
      [0.3, L],
      [0, L],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const g = new THREE.LatheGeometry(pts, 64);
    g.rotateZ(-Math.PI / 2); // l'axe du tour devient l'axe X
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Une côte du sabot : dent recourbée qui passe devant la lame */
function useCoteGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.02);
    s.lineTo(0.5, -0.02);
    s.quadraticCurveTo(0.78, -0.06, 0.74, -0.42);
    s.lineTo(0.66, -0.44);
    s.quadraticCurveTo(0.66, -0.13, 0.46, -0.1);
    s.lineTo(0, -0.08);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 });
    g.translate(0, 0, -0.015);
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Gravure « DÉGRADÉ » dorée sur le flanc */
function makeGravure() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 128);
  ctx.fillStyle = "rgba(214,180,125,0.95)";
  ctx.font = "600 58px 'Figtree', sans-serif";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "26px";
  ctx.fillText("DÉGRADÉ", 40, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Place N instances régulièrement le long de la largeur (axe Z) */
function useRangee(ref: React.RefObject<THREE.InstancedMesh | null>, n: number, largeur: number) {
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      o.position.set(0, 0, -largeur / 2 + (i + 0.5) * (largeur / n));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [ref, n, largeur]);
}

function Tondeuse({ onReady, centre = false }: { onReady?: () => void; centre?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sabot = useRef<THREE.Group>(null);
  const lameMobile = useRef<THREE.Group>(null);
  const dentsFixes = useRef<THREE.InstancedMesh>(null);
  const dentsMobiles = useRef<THREE.InstancedMesh>(null);
  const cotes = useRef<THREE.InstancedMesh>(null);
  const temoin = useRef<THREE.Mesh>(null);
  const smooth = useRef({ p: 0, rx: 0, ry: 0 });
  const readySent = useRef(false);
  const { viewport, invalidate } = useThree();

  const corpsGeo = useCorpsGeometry();
  const coteGeo = useCoteGeometry();
  const dentGeo = useMemo(() => new THREE.BoxGeometry(0.16, 0.035, 0.026), []);
  const gravureGeo = useMemo(() => new THREE.PlaneGeometry(1.5, 0.19), []);
  const bagueGeo = useMemo(() => new THREE.TorusGeometry(0.435, 0.03, 16, 64), []);
  const nervureGeo = useMemo(() => new THREE.TorusGeometry(0.455, 0.012, 8, 64), []);

  useRangee(dentsFixes, DENTS, LARGEUR);
  useRangee(dentsMobiles, DENTS - 2, LARGEUR - 0.08);
  useRangee(cotes, COTES, LARGEUR - 0.02);

  const mats = useMemo(() => {
    const laque = new THREE.MeshPhysicalMaterial({ color: "#2b2926", metalness: 0.55, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.8 });
    const nervure = new THREE.MeshStandardMaterial({ color: "#4a4540", metalness: 0.6, roughness: 0.45 });
    const or = new THREE.MeshPhysicalMaterial({ color: "#d6b47d", metalness: 1, roughness: 0.22, clearcoat: 0.4, envMapIntensity: 1.3 });
    const chrome = new THREE.MeshPhysicalMaterial({ color: "#e4e7ea", metalness: 1, roughness: 0.14, envMapIntensity: 1.4 });
    const acierFonce = new THREE.MeshStandardMaterial({ color: "#9aa0a6", metalness: 1, roughness: 0.3 });
    const peigne = new THREE.MeshPhysicalMaterial({ color: "#34302b", metalness: 0.1, roughness: 0.35, clearcoat: 0.8, envMapIntensity: 1.5, transparent: true, opacity: 1 });
    const temoin = new THREE.MeshStandardMaterial({ color: "#2a2216", emissive: "#f5c46a", emissiveIntensity: 0 });
    const gravure = new THREE.MeshBasicMaterial({ map: makeGravure(), transparent: true, depthWrite: false });
    return { laque, nervure, or, chrome, acierFonce, peigne, temoin, gravure };
  }, []);

  useEffect(
    () => () => {
      [corpsGeo, coteGeo, dentGeo, gravureGeo, bagueGeo, nervureGeo].forEach((g) => g.dispose());
      mats.gravure.map?.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [corpsGeo, coteGeo, dentGeo, gravureGeo, bagueGeo, nervureGeo, mats],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
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
    const lever = easeInOut(range(p, 0, 0.6));
    const base = centre ? Math.min(w * 0.17, h * 0.18) : portrait ? w * 0.18 : Math.min(w * 0.1, h * 0.14);
    g.scale.setScalar(base * THREE.MathUtils.lerp(1, 1.15, lever));

    // 1. Le sabot glisse vers l'avant et s'efface (0,05 → 0,4)
    const retire = easeInOut(range(p, 0.05, 0.4));
    if (sabot.current) {
      sabot.current.position.set(L + 0.02 + retire * 1.4, retire * 0.25, 0);
      sabot.current.visible = retire < 0.99;
      sabot.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m) m.opacity = 1 - retire;
      });
    }

    // 2. Mise en marche : témoin allumé, lame mobile qui vibre, léger frisson du corps
    const marche = easeInOut(range(p, 0.3, 0.45));
    const led = temoin.current?.material as THREE.MeshStandardMaterial | undefined;
    if (led) led.emissiveIntensity = marche * 3;
    if (lameMobile.current) lameMobile.current.position.z = Math.sin(t * 190) * 0.014 * marche;
    const frisson = Math.sin(t * 157) * 0.004 * marche;

    // 3. L'objet se redresse et pivote pour montrer la denture
    const yRepos = centre ? 0 : portrait ? -0.14 * h : -0.17 * h;
    g.position.set(frisson * base, THREE.MathUtils.lerp(yRepos, 0, lever) + Math.sin(t * 1.1) * 0.03 * base, 0);
    const tour = easeInOut(range(p, 0.3, 1));
    g.rotation.set(
      THREE.MathUtils.lerp(0.35, 0.2, lever) + sm.rx * 0.6 + Math.sin(t * 0.7) * 0.03,
      THREE.MathUtils.lerp(-0.45, -1.05, tour) + sm.ry * 0.6,
      THREE.MathUtils.lerp(0.34, 0.12, lever) + Math.sin(t * 0.5) * 0.02 + frisson,
    );

    if (!readySent.current) {
      readySent.current = true;
      onReady?.();
    }
    if (state.frameloop === "demand") invalidate();
  });

  return (
    <group ref={group}>
      {/* Objet centré sur son milieu */}
      <group position={[-(L + 0.5) / 2, 0, 0]}>
        {/* Corps : section ovale, plus large que haute */}
        <group scale={[1, 0.74, 1]}>
          <mesh geometry={corpsGeo} material={mats.laque} />
          <mesh geometry={bagueGeo} material={mats.or} position={[2.55, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 1.03, 1.03]} />
          {[0.55, 0.72, 0.89, 1.06, 1.23].map((x) => (
            <mesh key={x} geometry={nervureGeo} material={mats.nervure} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.98, 0.98, 0.98]} />
          ))}
        </group>
        {/* Gravure dorée sur le flanc visible */}
        <mesh geometry={gravureGeo} material={mats.gravure} position={[1.75, -0.02, 0.455]} />
        {/* Interrupteur et témoin, sur le dessus */}
        <RoundedBox args={[0.42, 0.07, 0.2]} radius={0.03} smoothness={3} material={mats.or} position={[3.05, 0.39, 0]} rotation={[0, 0, -0.08]} />
        <mesh ref={temoin} material={mats.temoin} position={[3.45, 0.38, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
        </mesh>

        {/* Tête : support noir, lame fixe et lame mobile */}
        <group position={[L - 0.02, -0.02, 0]} rotation={[0, 0, -0.32]}>
          <RoundedBox args={[0.26, 0.36, LARGEUR + 0.02]} radius={0.05} smoothness={3} material={mats.laque} position={[0.02, 0.04, 0]} />
          <mesh material={mats.chrome} position={[0.2, -0.08, 0]}>
            <boxGeometry args={[0.3, 0.05, LARGEUR]} />
          </mesh>
          <instancedMesh ref={dentsFixes} args={[dentGeo, mats.chrome, DENTS]} position={[0.42, -0.08, 0]} />
          <group ref={lameMobile}>
            <mesh material={mats.acierFonce} position={[0.18, -0.03, 0]}>
              <boxGeometry args={[0.24, 0.04, LARGEUR - 0.08]} />
            </mesh>
            <instancedMesh ref={dentsMobiles} args={[dentGeo, mats.acierFonce, DENTS - 2]} position={[0.36, -0.03, 0]} scale={[0.75, 1, 1]} />
          </group>
        </group>

        {/* Sabot : barrette + côtes recourbées */}
        <group ref={sabot} position={[L + 0.02, 0, 0]} rotation={[0, 0, -0.32]}>
          <mesh material={mats.peigne} position={[0.06, 0.02, 0]}>
            <boxGeometry args={[0.16, 0.1, LARGEUR + 0.04]} />
          </mesh>
          <instancedMesh ref={cotes} args={[coteGeo, mats.peigne, COTES]} />
        </group>
      </group>
    </group>
  );
}

export default function TondeuseScene({ active, onReady, centre }: { active: boolean; onReady?: () => void; centre?: boolean }) {
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
      {/* Contre-jour chaud : détache la laque sombre du fond noir */}
      <pointLight position={[2.5, 3, 2]} intensity={18} color="#ffd9a0" distance={14} />
      <pointLight position={[-3, 2.5, -2]} intensity={10} color="#fff1dc" distance={12} />
      <Environment resolution={256} frames={1}>
        {/* Fond d'atelier gris : la laque et le chrome ne tombent jamais dans le noir */}
        <color attach="background" args={["#3a3a3a"]} />
        <Lightformer form="rect" intensity={1.4} position={[0, 2.5, 10]} scale={[16, 2, 1]} color="#e9e4da" />
        <Lightformer form="rect" intensity={2.2} position={[0, -1, 10]} scale={[16, 1, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.8} position={[0, -3.5, 9]} scale={[16, 2.5, 1]} color="#c3c8cc" />
        <Lightformer form="rect" intensity={5} position={[0, 4, 4]} rotation-x={Math.PI / 2.5} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 1.4, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 0.6, 1]} />
        <Lightformer form="ring" color="#e6c48c" intensity={2.5} position={[0, 0, -6]} scale={3} />
        <Lightformer form="rect" color="#ffffff" intensity={0.8} position={[0, -4, 1]} rotation-x={Math.PI / 2} scale={[6, 0.4, 1]} />
      </Environment>
      <Tondeuse onReady={onReady} centre={centre} />
    </Canvas>
  );
}
