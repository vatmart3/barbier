"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "unknown" | "none" | "low" | "high";

/**
 * Décide si la 3D peut tourner : WebGL disponible, pas de mouvement réduit,
 * appareil assez puissant (cœurs CPU, mémoire, renderer GPU logiciel exclu).
 */
export function detectTier(): Exclude<DeviceTier, "unknown"> {
  if (typeof window === "undefined") return "none";
  const force = new URLSearchParams(window.location.search).get("3d");
  if (force === "off") return "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && force !== "on") return "none";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "none";
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl = (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ?? canvas.getContext("webgl");
  } catch {
    gl = null;
  }
  if (!gl) return "none";
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  if (force === "on") return "high";
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return "low";
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  if (cores <= 2 || mem < 2) return "low";
  if (cores <= 4 && mem <= 2) return "low";
  return "high";
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("unknown");
  useEffect(() => {
    // Détection différée : ne bloque pas le premier rendu
    const id = window.requestAnimationFrame(() => setTier(detectTier()));
    return () => window.cancelAnimationFrame(id);
  }, []);
  return tier;
}
