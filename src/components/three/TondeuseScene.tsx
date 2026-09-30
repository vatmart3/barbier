"use client";

/**
 * Tondeuse de barbier 3D, 100 % procédurale (aucun modèle à télécharger),
 * dessinée d'après une tondeuse de coupe moderne :
 * - Corps : LatheGeometry aplatie qui s'évase vers la tête, noir mat.
 * - Tête : capot noir laqué cerclé d'un liseré chromé en V.
 * - Lame fixe et lame mobile chromées (dents en InstancedMesh), levier de
 *   réglage sur le flanc, bouton ovale chromé, témoin lumineux.
 * - Reflets : environnement fait de Lightformers (pas de HDR distante).
 * Le scroll (heroState.p) allume la tondeuse (la lame mobile vibre, le
 * témoin s'éclaire) et fait pivoter l'objet pour montrer la denture.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/components/home/heroState";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Longueur du corps, de la queue (x = 0) à la tête */
const L = 4.12;
/** Aplatissement de la section (hauteur / largeur) */
const APLAT = 0.62;
const DENTS = 26;
const LARGEUR = 1.04;

/** Profil (rayon, position le long de l'axe) : queue arrondie, corps fin qui s'évase vers la tête */
const PROFIL: [number, number][] = [
  [0, 0],
  [0.22, 0.03],
  [0.33, 0.12],
  [0.37, 0.35],
  [0.38, 1.0],
  [0.41, 1.8],
  [0.47, 2.6],
  [0.55, 3.3],
  [0.58, 3.75],
  [0.56, 3.98],
  [0.48, 4.08],
  [0.3, L],
  [0, L],
];

/** Rayon du corps à l'abscisse x (interpolation du profil) */
function rayon(x: number) {
  for (let i = 1; i < PROFIL.length; i++) {
    const [r1, x1] = PROFIL[i];
    const [r0, x0] = PROFIL[i - 1];
    if (x <= x1) return r0 + ((r1 - r0) * (x - x0)) / Math.max(1e-6, x1 - x0);
  }
  return 0;
}

/** Hauteur de la surface supérieure du corps en (x, z) */
const dessus = (x: number, z: number) =>
  APLAT * Math.sqrt(Math.max(0, rayon(x) ** 2 - z * z));

function useTour(de: number, gonfle = 0) {
  return useMemo(() => {
    const pts = PROFIL.filter(([, y]) => y >= de).map(
      ([r, y]) => new THREE.Vector2(r + (r > 0 ? gonfle : 0), y),
    );
    if (de > 0) pts.unshift(new THREE.Vector2(rayon(de) + gonfle, de));
    const g = new THREE.LatheGeometry(pts, 72);
    g.rotateZ(-Math.PI / 2); // l'axe du tour devient l'axe X
    g.computeVertexNormals();
    return g;
  }, [de, gonfle]);
}

/** Liseré chromé en V sur le capot de la tête */
function useLisere() {
  return useMemo(() => {
    const pts = [
      [4.02, 0.44],
      [3.6, 0.44],
      [3.15, 0.3],
      [2.85, 0],
      [3.15, -0.3],
      [3.6, -0.44],
      [4.02, -0.44],
    ].map(([x, z]) => new THREE.Vector3(x, dessus(x, z) + 0.012, z));
    const g = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts, false, "centripetal"),
      96,
      0.022,
      10,
      false,
    );
    return g;
  }, []);
}

/** Gravure « DÉGRADÉ » argentée sur le flanc */
function makeGravure() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 128);
  ctx.fillStyle = "rgba(205,208,212,0.85)";
  ctx.font = "600 58px 'Figtree', sans-serif";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "26px";
  ctx.fillText("DÉGRADÉ", 40, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Place N instances régulièrement le long de la largeur (axe Z) */
function useRangee(
  ref: React.RefObject<THREE.InstancedMesh | null>,
  n: number,
  largeur: number,
) {
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

function Tondeuse({
  onReady,
  centre = false,
}: {
  onReady?: () => void;
  centre?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const lameMobile = useRef<THREE.Group>(null);
  const dentsFixes = useRef<THREE.InstancedMesh>(null);
  const dentsMobiles = useRef<THREE.InstancedMesh>(null);
  const temoin = useRef<THREE.Mesh>(null);
  const smooth = useRef({ p: 0, rx: 0, ry: 0 });
  const readySent = useRef(false);
  const { viewport, invalidate } = useThree();

  const corpsGeo = useTour(0);
  const capotGeo = useTour(2.9, 0.006);
  const lisereGeo = useLisere();
  const dentGeo = useMemo(() => new THREE.BoxGeometry(0.17, 0.03, 0.024), []);
  const gravureGeo = useMemo(() => new THREE.PlaneGeometry(1.2, 0.15), []);
  const visGeo = useMemo(
    () => new THREE.CylinderGeometry(0.035, 0.035, 0.02, 20),
    [],
  );

  useRangee(dentsFixes, DENTS, LARGEUR);
  useRangee(dentsMobiles, DENTS - 2, LARGEUR - 0.08);

  const mats = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#161616",
      metalness: 0.25,
      roughness: 0.5,
      clearcoat: 0.25,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.4,
    });
    const laque = new THREE.MeshPhysicalMaterial({
      color: "#0e0e0e",
      metalness: 0.4,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2,
    });
    const chrome = new THREE.MeshPhysicalMaterial({
      color: "#eef0f2",
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 1.6,
    });
    const acierFonce = new THREE.MeshStandardMaterial({
      color: "#9aa0a6",
      metalness: 1,
      roughness: 0.3,
    });
    const rainure = new THREE.MeshStandardMaterial({
      color: "#5a5e62",
      metalness: 0.9,
      roughness: 0.35,
    });
    const temoin = new THREE.MeshStandardMaterial({
      color: "#1b1f1d",
      emissive: "#7df0b0",
      emissiveIntensity: 0,
    });
    const gravure = new THREE.MeshBasicMaterial({
      map: makeGravure(),
      transparent: true,
      depthWrite: false,
    });
    return { mat, laque, chrome, acierFonce, rainure, temoin, gravure };
  }, []);

  useEffect(
    () => () => {
      [corpsGeo, capotGeo, lisereGeo, dentGeo, gravureGeo, visGeo].forEach(
        (g) => g.dispose(),
      );
      mats.gravure.map?.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [corpsGeo, capotGeo, lisereGeo, dentGeo, gravureGeo, visGeo, mats],
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
    const base = centre
      ? Math.min(w * 0.17, h * 0.18)
      : portrait
        ? w * 0.18
        : Math.min(w * 0.1, h * 0.14);
    g.scale.setScalar(base * THREE.MathUtils.lerp(1, 1.12, lever));

    // 1. Mise en marche : témoin allumé, lame mobile qui vibre, léger frisson du corps
    const marche = easeInOut(range(p, 0.15, 0.35));
    const led = temoin.current?.material as
      | THREE.MeshStandardMaterial
      | undefined;
    if (led) led.emissiveIntensity = marche * 3;
    if (lameMobile.current)
      lameMobile.current.position.z = Math.sin(t * 190) * 0.014 * marche;
    const frisson = Math.sin(t * 157) * 0.004 * marche;

    // 2. L'objet se redresse et pivote pour montrer la denture
    const yRepos = centre ? 0 : portrait ? -0.14 * h : -0.17 * h;
    g.position.set(
      frisson * base,
      THREE.MathUtils.lerp(yRepos, 0, lever) + Math.sin(t * 1.1) * 0.03 * base,
      0,
    );
    const tour = easeInOut(range(p, 0.3, 1));
    // Diagonale tête en haut à droite, puis quart de tour pour montrer la denture
    g.rotation.set(
      sm.rx * 0.5 + Math.sin(t * 0.7) * 0.03,
      THREE.MathUtils.lerp(0, -0.85, tour) + sm.ry * 0.5,
      THREE.MathUtils.lerp(0.62, 0.3, lever) +
        Math.sin(t * 0.5) * 0.02 +
        frisson,
    );

    if (!readySent.current) {
      readySent.current = true;
      onReady?.();
    }
    if (state.frameloop === "demand") invalidate();
  });

  const xBouton = 2.35;
  const xLevier = 3.62;

  return (
    <group ref={group}>
      {/* Dessus (liseré, bouton) tourné vers le regard ; objet centré sur son milieu */}
      <group rotation={[1.05, 0, 0]}>
        <group position={[-(L + 0.4) / 2, 0, 0]}>
          {/* Corps noir mat, capot de tête laqué (section aplatie) */}
          <group scale={[1, APLAT, 1]}>
            <mesh geometry={corpsGeo} material={mats.mat} />
            <mesh geometry={capotGeo} material={mats.laque} />
          </group>
          {/* Liseré chromé en V sur le capot */}
          <mesh geometry={lisereGeo} material={mats.chrome} />

          {/* Bouton ovale chromé à deux rainures + témoin */}
          <group position={[xBouton, dessus(xBouton, 0) + 0.015, 0]}>
            <RoundedBox
              args={[0.34, 0.06, 0.2]}
              radius={0.028}
              smoothness={4}
              material={mats.chrome}
            />
            {[-0.05, 0.05].map((dx) => (
              <mesh key={dx} material={mats.rainure} position={[dx, 0.031, 0]}>
                <boxGeometry args={[0.018, 0.006, 0.15]} />
              </mesh>
            ))}
          </group>
          <mesh
            ref={temoin}
            material={mats.temoin}
            position={[xBouton + 0.36, dessus(xBouton + 0.36, 0) + 0.01, 0]}
          >
            <sphereGeometry args={[0.028, 16, 16]} />
          </mesh>

          {/* Deux vis chromées côté queue */}
          {[0.42, 0.78].map((x) => (
            <mesh
              key={x}
              geometry={visGeo}
              material={mats.chrome}
              position={[x, dessus(x, 0) + 0.004, 0]}
            />
          ))}

          {/* Gravure argentée sur le flanc */}
          <mesh
            geometry={gravureGeo}
            material={mats.gravure}
            position={[1.45, 0, rayon(1.45) + 0.004]}
          />

          {/* Levier de réglage de la lame, sur le flanc de la tête */}
          <group
            position={[xLevier, -0.02, rayon(xLevier) + 0.05]}
            rotation={[0, 0, -0.55]}
          >
            <mesh material={mats.chrome} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 20]} />
            </mesh>
            <RoundedBox
              args={[0.62, 0.1, 0.06]}
              radius={0.03}
              smoothness={3}
              material={mats.laque}
              position={[-0.28, 0, 0.01]}
            />
          </group>

          {/* Tête : support noir, lame fixe chromée, lame mobile */}
          <group position={[L - 0.04, -0.01, 0]} rotation={[0, 0, -0.3]}>
            <RoundedBox
              args={[0.2, 0.3, LARGEUR + 0.02]}
              radius={0.05}
              smoothness={3}
              material={mats.laque}
              position={[0.02, 0.03, 0]}
            />
            <mesh material={mats.chrome} position={[0.2, -0.07, 0]}>
              <boxGeometry args={[0.3, 0.045, LARGEUR]} />
            </mesh>
            <instancedMesh
              ref={dentsFixes}
              args={[dentGeo, mats.chrome, DENTS]}
              position={[0.42, -0.07, 0]}
            />
            <group ref={lameMobile}>
              <mesh material={mats.acierFonce} position={[0.18, -0.025, 0]}>
                <boxGeometry args={[0.24, 0.04, LARGEUR - 0.08]} />
              </mesh>
              <instancedMesh
                ref={dentsMobiles}
                args={[dentGeo, mats.acierFonce, DENTS - 2]}
                position={[0.36, -0.025, 0]}
                scale={[0.75, 1, 1]}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function TondeuseScene({
  active,
  onReady,
  centre,
}: {
  active: boolean;
  onReady?: () => void;
  centre?: boolean;
}) {
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
      <directionalLight
        position={[-4, -2, 3]}
        intensity={0.5}
        color="#ffffff"
      />
      {/* Contre-jours neutres : détachent le noir mat et le chrome du fond */}
      <pointLight
        position={[2.5, 3, 2]}
        intensity={16}
        color="#ffffff"
        distance={14}
      />
      <pointLight
        position={[-3, 2.5, -2]}
        intensity={10}
        color="#fff1dc"
        distance={12}
      />
      <Environment resolution={256} frames={1}>
        {/* Fond d'atelier gris : la laque et le chrome ne tombent jamais dans le noir */}
        <color attach="background" args={["#3a3a3a"]} />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[0, 2.5, 10]}
          scale={[16, 2, 1]}
          color="#e9e4da"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, -1, 10]}
          scale={[16, 1, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          position={[0, -3.5, 9]}
          scale={[16, 2.5, 1]}
          color="#c3c8cc"
        />
        <Lightformer
          form="rect"
          intensity={5}
          position={[0, 4, 4]}
          rotation-x={Math.PI / 2.5}
          scale={[10, 1.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[-5, 0, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 1.4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[8, 0.6, 1]}
        />
        <Lightformer
          form="ring"
          color="#f2f2f2"
          intensity={2.5}
          position={[0, 0, -6]}
          scale={3}
        />
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={0.8}
          position={[0, -4, 1]}
          rotation-x={Math.PI / 2}
          scale={[6, 0.4, 1]}
        />
      </Environment>
      <Tondeuse onReady={onReady} centre={centre} />
    </Canvas>
  );
}
