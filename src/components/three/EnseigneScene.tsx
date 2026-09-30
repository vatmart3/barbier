"use client";

/**
 * Enseigne de barbier 3D (cylindre + spirale en shader GLSL maison).
 * La spirale tourne au rythme du scroll : c'est l'indicateur de progression.
 * frameloop="demand" : on ne rend une image que quand le scroll bouge.
 */
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uRed;
  uniform vec3 uCream;
  uniform vec3 uSteel;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    // 3 bandes par tour, inclinées ; le défilement fait tourner la spirale
    float s = fract(vUv.x * 3.0 + vUv.y * 2.2 - uProgress * 9.0);
    vec3 col = s < 0.34 ? uRed : (s < 0.5 ? uCream : (s < 0.84 ? uSteel : uCream));
    // Anti-crénelage léger sur les arêtes des bandes
    float edge = min(min(abs(s - 0.34), abs(s - 0.5)), min(abs(s - 0.84), min(s, 1.0 - s)));
    col = mix(col * 0.82, col, smoothstep(0.0, 0.02, edge));
    // Verre : éclairage latéral + reflet vertical
    float light = 0.55 + 0.45 * max(dot(vNormal, normalize(vec3(0.6, 0.3, 1.0))), 0.0);
    float spec = pow(max(dot(vNormal, normalize(vec3(-0.3, 0.2, 1.0))), 0.0), 28.0);
    gl_FragColor = vec4(col * light + spec * 0.6, 1.0);
  }
`;

function Pole({ progress }: { progress: { current: number } }) {
  const invalidate = useThree((s) => s.invalidate);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uProgress: { value: 0 },
          uRed: { value: new THREE.Color("#c8102e") },
          uCream: { value: new THREE.Color("#f2ede4") },
          uSteel: { value: new THREE.Color("#9aa0a6") },
        },
      }),
    [],
  );
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d9dde0", metalness: 1, roughness: 0.25 }), []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const u = material.uniforms.uProgress;
      const next = u.value + (progress.current - u.value) * 0.18;
      if (Math.abs(next - u.value) > 0.00005) {
        u.value = next;
        invalidate();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      material.dispose();
      chrome.dispose();
    };
  }, [material, chrome, invalidate, progress]);

  return (
    <group rotation={[0, 0, 0]}>
      <mesh material={material}>
        <cylinderGeometry args={[0.36, 0.36, 2.2, 40, 1, true]} />
      </mesh>
      <mesh material={chrome} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.46, 0.42, 0.2, 32]} />
      </mesh>
      <mesh material={chrome} position={[0, 1.42, 0]}>
        <sphereGeometry args={[0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh material={chrome} position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.2, 32]} />
      </mesh>
      <mesh material={chrome} position={[0, -1.42, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

export default function EnseigneScene({ progress }: { progress: { current: number } }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={2.2} />
      <directionalLight position={[-3, -1, 2]} intensity={0.8} color="#9aa0a6" />
      <Pole progress={progress} />
    </Canvas>
  );
}
