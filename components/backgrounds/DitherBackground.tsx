"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { dither, type DitherMode } from "@/config/effects";
import { features } from "@/config/features";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { asset, cn } from "@/lib/utils";

/**
 * Ordered-dither field rendered with a small WebGL fragment shader.
 *
 * - One instance per page (hero). It draws a procedural interference pattern,
 *   quantised with a Bayer matrix (or halftone / noise / crosshatch) into a
 *   duotone built from the active theme's colours.
 * - Runs at a capped frame rate, pauses off-screen and in hidden tabs.
 * - Falls back to a static dither mask (CSS) when WebGL is unavailable, the
 *   feature flag is off, or the visitor prefers reduced motion.
 * - Settings: config/effects.ts.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_cell;
uniform float u_mode;
uniform float u_intensity;
uniform float u_accent;
uniform vec3 u_dark;
uniform vec3 u_light;
uniform vec3 u_hot;

float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = floor(frag / u_cell);
  vec2 centre = (cell + 0.5) * u_cell;
  vec2 uv = centre / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.0;
  p -= u_pointer * 0.35;
  float t = u_time;

  // Interference of a few slow wavefronts: reads as signal, not as noise.
  float v = 0.0;
  v += sin(p.x * 2.1 + t * 0.7);
  v += sin(p.y * 3.3 - t * 0.9);
  v += sin(length(p - vec2(0.9, 0.1)) * 5.5 - t * 1.3);
  v += sin(length(p + vec2(0.7, 0.6)) * 4.2 + t * 0.8);
  v = v * 0.125 + 0.5;

  // Composition: strongest on the right and top, quiet where the text sits.
  float mask = smoothstep(0.1, 0.95, uv.x) * (0.5 + 0.5 * smoothstep(0.0, 0.85, uv.y));
  float lum = clamp(pow(v, 1.6) * mask * u_intensity * 1.8, 0.0, 1.0);

  float on = 0.0;
  if (u_mode < 0.5) {
    on = step(bayer8(cell), lum);
  } else if (u_mode < 1.5) {
    float r = length(fract(frag / u_cell) - 0.5);
    on = step(r, sqrt(lum) * 0.62);
  } else if (u_mode < 2.5) {
    on = step(hash(cell + floor(t * 2.0)), lum);
  } else {
    float d1 = mod(frag.x + frag.y, u_cell * 3.0) / (u_cell * 3.0);
    float d2 = mod(frag.x - frag.y, u_cell * 3.0) / (u_cell * 3.0);
    on = clamp(step(0.45, lum) * step(d1, 0.22) + step(0.75, lum) * step(d2, 0.22), 0.0, 1.0);
  }

  float hot = step(1.0 - u_accent, hash(cell * 1.37 + 7.0));
  vec3 col = mix(u_dark, mix(u_light, u_hot, hot), on);
  gl_FragColor = vec4(col, 1.0);
}
`;

const MODE_INDEX: Record<DitherMode, number> = { bayer: 0, halftone: 1, noise: 2, crosshatch: 3 };

function parseColour(value: string, fallback: [number, number, number]): [number, number, number] {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
  }
  return fallback;
}

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function readThemeColours() {
  const css = getComputedStyle(document.documentElement);
  const dark = parseColour(css.getPropertyValue("--obsidian"), [0.02, 0.02, 0.02]);
  const stone = parseColour(css.getPropertyValue("--stone"), [0.62, 0.6, 0.58]);
  const accent = parseColour(css.getPropertyValue("--accent"), [0.44, 0.06, 0.07]);
  // Lit cells are a muted stone rather than full ivory, so the field stays quiet behind text.
  return { dark, light: mix(dark, stone, 0.55), hot: mix(dark, accent, 1) };
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Dither shader failed to compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function DitherBackground({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const [state, setState] = useState<"pending" | "ok" | "failed">("pending");
  const enabled = features.ditherShader && !reduce;

  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    if (!host) return;

    // A fresh canvas per effect run. A canvas whose context was released in a previous
    // cleanup (React StrictMode mounts effects twice in dev) hands back a *lost* context,
    // which makes every shader "fail to compile" with a null log.
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";
    host.appendChild(canvas);

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.remove();
      setState("failed");
      return;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      canvas.remove();
      setState("failed");
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Dither shader failed to link:", gl.getProgramInfoLog(program));
      canvas.remove();
      setState("failed");
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("u_res");
    const uTime = u("u_time");
    const uPointer = u("u_pointer");
    const uCell = u("u_cell");
    const uMode = u("u_mode");
    const uIntensity = u("u_intensity");
    const uAccent = u("u_accent");
    const uDark = u("u_dark");
    const uLight = u("u_light");
    const uHot = u("u_hot");

    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let time = 0;
    let last = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const applyColours = () => {
      const c = readThemeColours();
      gl.uniform3fv(uDark, c.dark);
      gl.uniform3fv(uLight, c.light);
      gl.uniform3fv(uHot, c.hot);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, dither.pixelRatioCap);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uCell, Math.max(1, Math.round(dither.gridSize * dpr)));
    };

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const minDelta = 1000 / dither.maxFps;
      const delta = now - last;
      if (delta < minDelta) return;
      last = now - (delta % minDelta);
      time += (Math.min(delta, 100) / 1000) * dither.speed;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      draw();
    };

    const start = () => {
      if (running || !dither.animated || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    gl.uniform1f(uMode, MODE_INDEX[dither.mode]);
    gl.uniform1f(uIntensity, dither.intensity);
    gl.uniform1f(uAccent, dither.accentAmount);
    applyColours();
    resize();
    draw();
    setState("ok");
    if (dither.animated) start();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const mo = new MutationObserver(() => {
      applyColours();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * dither.pointerInfluence;
      pointer.ty = -((e.clientY - rect.top) / rect.height - 0.5) * 2 * dither.pointerInfluence;
    };
    if (finePointer && dither.pointerInfluence > 0) window.addEventListener("pointermove", onMove, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      setState("failed");
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [enabled, finePointer]);

  const style = { "--dither-mask": `url(${asset(dither.fallbackMask)})` } as CSSProperties;
  const showStatic = !enabled || state !== "ok";

  return (
    <div aria-hidden="true" className={cn("pointer-events-none overflow-hidden", className)} style={style}>
      {showStatic && <div className="dither-static" />}
      {/* the WebGL canvas is appended here by the effect */}
      <div ref={hostRef} className="absolute inset-0" />
    </div>
  );
}
