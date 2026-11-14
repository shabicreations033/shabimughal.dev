// Ink-bleed theme reveal: WebGL2 shader.
//
// Adapted from "Ink Bleed" by Codemure (https://www.codemure.com), MIT License,
// Copyright (c) 2026 Codemure. The noise texture and the ink-shape shader are ported from
// that project; the page snapshots are not: here the browser's own View Transitions API
// supplies the "old" and "new" pages, so nothing has to be re-drawn by hand (no html2canvas).
//
// How it works: a small WebGL canvas renders only the *shape* of the ink (coverage, 0..1) each
// frame. The frame is handed to the page as the CSS variable --ink-mask, which masks the "new
// theme" snapshot (see index.css). If WebGL2 is missing, startInkGL returns null and the caller
// uses the plain canvas version in inkReveal.js.

const NOISE_SIZE = 256;
const NOISE_CELLS = 32;
const MASK_MAX_W = 1280; // mask canvas width in px; it is stretched to the screen (wider = sharper edge, slightly heavier per frame)

// Look of the ink (same defaults as the original project)
const PARAMS = { tendril: 1, noiseScale: 1, softness: 1.2, drift: 1 };
const SPREAD = { growth: 0.7, cleanupFrom: 0.45, cleanupReach: 0.4, cleanupPow: 2 };

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
precision highp int;

uniform float uCanvasScale; // canvas px per CSS px
uniform vec2 uRes;          // canvas px

uniform vec2 uCenter;       // CSS px, viewport-relative
uniform float uRadius;      // CSS px, eased base radius
uniform float uCleanup;     // CSS px, extra uniform reach that guarantees full coverage at the end
uniform float uTime;        // seconds since click (scaled by slow-mo)
uniform float uRef;         // CSS px, noise reference length (max viewport side)
uniform vec2 uSeed;
uniform mat2 uSeedRot;

uniform float uTendril;     // tendril intensity, 0..2
uniform float uNoiseScale;  // noise frequency multiplier
uniform float uSoftness;    // frontier half-width, CSS px
uniform float uDrift;       // time evolution speed

out vec4 outColor;

// Shape budget: how far (relative to R) the blob may lead / lag the base circle.
const float A_LOBE = 0.22;
const float A_BLOB = 0.20;
const float A_SUM = A_LOBE + A_BLOB;
const float TENDRIL_REACH = 0.24; // x R x uTendril
const float FIBRE_PX = 1.8;
const float THIN_MAX_PX = 26.0;
const float SPECK_PX = 18.0;
const float HAZE_PX = 16.0; // must stay <= SPECK_PX (outer bound)

// ---------- noise ----------

// Precomputed tileable gradient noise (see noiseTexture.ts): one lattice unit per
// 1/NOISE_CELLS of the texture. textureLod keeps sampling independent of derivatives,
// which are undefined inside the early-out branches above.
uniform sampler2D uNoise;
const float INV_CELLS = 1.0 / 32.0;

// Gradient noise, roughly [-1, 1].
float gnoise(vec2 p) {
  return textureLod(uNoise, p * INV_CELLS, 0.0).r * 2.0 - 1.0;
}

// Second, decorrelated channel (fibres, speckles).
float gnoise2(vec2 p) {
  return textureLod(uNoise, p * INV_CELLS, 0.0).g * 2.0 - 1.0;
}

const mat2 OCT = mat2(0.8, 0.6, -0.6, 0.8) * 2.03;

float fbm3(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * gnoise(p); p = OCT * p + 17.13; a *= 0.5; }
  return s / 0.875;
}

float fbm4(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * gnoise(p); p = OCT * p + 17.13; a *= 0.5; }
  return s / 0.9375;
}

float fbm5(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * gnoise(p); p = OCT * p + 17.13; a *= 0.5; }
  return s / 0.96875;
}

void main() {
  vec2 devPx = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 css = devPx / uCanvasScale;
  vec2 rel = css - uCenter;
  float d = length(rel);
  float R = uRadius;
  float cleanup = uCleanup;

  // Conservative bounds on f: skip the noise entirely far from the frontier.
  float inner = R * (1.0 - A_SUM) + cleanup - FIBRE_PX - THIN_MAX_PX - uSoftness * 2.0;
  float outer = R * (1.0 + A_SUM) * (1.0 + TENDRIL_REACH * uTendril) + cleanup + FIBRE_PX + SPECK_PX + uSoftness * 2.0;
  if (d < inner) {
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }
  if (d > outer) {
    outColor = vec4(0.0);
    return;
  }

  float t = uTime * uDrift;
  vec2 p = rel / uRef;
  vec2 dir = uSeedRot * (rel / max(d, 1e-3));
  float ns = uNoiseScale;

  // Domain warp, evolving over time so the edge boils rather than scales.
  vec2 q = p * (2.4 * ns) + uSeed;
  vec2 w = vec2(
    fbm3(q + vec2(0.0, 0.31 * t)),
    fbm3(q + vec2(5.2, 1.3) - vec2(0.27 * t, 0.0))
  );

  // Large irregular blob (warped fbm in page space: lazy at small radii, rich at large)
  // + smooth direction-only lobes so even a tiny drop is lopsided (anisotropy).
  float blob = fbm5(q + 2.3 * w + vec2(0.12 * t, -0.08 * t));
  vec2 lq = dir * 0.9 + uSeed.yx * 0.37 + vec2(0.06 * t);
  float lobes = gnoise(lq) * 0.75 + gnoise(lq * 2.1 + 9.1) * 0.25;
  float reach = clamp(1.0 + A_LOBE * 1.6 * lobes + A_BLOB * 1.5 * blob, 1.0 - A_SUM, 1.0 + A_SUM);
  float f = d - R * reach;

  // Tendrils: thin filaments along the zero-lines of an fbm sampled on the direction
  // circle. The distance term shifts the lines sideways as they extend (curl), the warp
  // bends them, and the fbm octaves make them fork. Each filament has a length (varying
  // per direction) and a width that tapers to a point at the tip.
  float gate = smoothstep(-0.35, 0.4, fbm3(dir * 1.6 + uSeed * 0.61 + 3.7));
  vec2 tq = dir * (2.2 * ns) + (d / uRef) * vec2(2.6, -1.9) * ns + 1.2 * w + uSeed * 1.7 + vec2(0.0, 0.18 * t);
  float n = fbm4(tq);
  float ridgePx = abs(n) * max(d, 24.0) / (4.0 * ns); // ~px distance to the filament's spine
  float lenN = gnoise(dir * 3.1 + uSeed * 0.43 + vec2(0.1 * t)) * 0.5 + 0.5;
  float L = uTendril * TENDRIL_REACH * R * gate * (0.35 + 0.65 * lenN);
  float along = clamp(f / max(L, 1.0), 0.0, 1.0); // 0 at the blob edge, 1 at the tip
  float width = clamp(R * 0.022, 1.5, 9.0) * (1.0 - along * along) * gate;
  float ft = max(f - L, ridgePx - width);
  // Smooth union: filaments flare into the blob instead of meeting it at a crease.
  float k = 6.0;
  float hh = clamp(0.5 + 0.5 * (ft - f) / k, 0.0, 1.0);
  f = mix(ft, f, hh) - k * hh * (1.0 - hh);

  // Paper fibres: static in screen space so they don't shimmer.
  vec2 fq = css * 0.34 + uSeed * 13.0;
  float fibre = gnoise2(fq) * 0.65 + gnoise2(OCT * fq + 5.3) * 0.35; // rotated octave hides the 32-unit tile
  f += fibre * FIBRE_PX;

  f -= cleanup;

  // ---------- compositing ----------
  float soft = max(uSoftness, 0.6);
  float inked = 1.0 - smoothstep(-soft, soft, f);

  // Ink thins just behind the frontier: ~0.6 density, rising to solid. Width varies with
  // the blob noise so the band never reads as a uniform outline.
  float thinW = mix(3.0, THIN_MAX_PX, clamp(blob * 0.8 + 0.3, 0.0, 1.0));
  float density = mix(0.6, 1.0, smoothstep(0.0, thinW, -f));
  float cov = inked * density;

  // Diffusion haze: a faint translucent gradient just ahead of the hard frontier, patchy
  // (driven by the fibre noise) so it reads as pigment bleeding into wet paper.
  float hazeW = mix(4.0, HAZE_PX, clamp(0.5 + 0.5 * blob, 0.0, 1.0));
  float haze = (1.0 - smoothstep(0.0, hazeW, f)) * smoothstep(-0.3, 0.6, 0.35 * fibre + w.x);
  cov = max(cov, haze * 0.24 * step(0.0, f));

  // Speckles: isolated droplets just ahead of the frontier, rarer with distance.
  float ahead = clamp(f / SPECK_PX, 0.0, 1.0);
  if (f > 0.0 && ahead < 1.0) {
    float sn = gnoise2(css * 0.55 + uSeed * 7.0 + 41.0) * 0.5 + 0.5;
    float th = mix(0.80, 0.96, ahead);
    cov = max(cov, smoothstep(th, th + 0.04, sn) * 0.75 * (1.0 - ahead));
  }

  // Output is only the coverage: the page's own snapshots are the two layers being revealed.
  outColor = vec4(0.0, 0.0, 0.0, cov);
}
`;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noiseChannel(rand) {
  const gx = new Float32Array(NOISE_CELLS * NOISE_CELLS);
  const gy = new Float32Array(NOISE_CELLS * NOISE_CELLS);
  for (let i = 0; i < gx.length; i++) {
    const a = rand() * Math.PI * 2;
    gx[i] = Math.cos(a);
    gy[i] = Math.sin(a);
  }
  const per = NOISE_SIZE / NOISE_CELLS;
  const out = new Float32Array(NOISE_SIZE * NOISE_SIZE);
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const at = (cx, cy) => ((cy + NOISE_CELLS) % NOISE_CELLS) * NOISE_CELLS + ((cx + NOISE_CELLS) % NOISE_CELLS);
  for (let y = 0; y < NOISE_SIZE; y++) {
    const py = (y + 0.5) / per;
    const cy = Math.floor(py);
    const fy = py - cy;
    const v = fade(fy);
    for (let x = 0; x < NOISE_SIZE; x++) {
      const px = (x + 0.5) / per;
      const cx = Math.floor(px);
      const fx = px - cx;
      const u = fade(fx);
      const i00 = at(cx, cy);
      const i10 = at(cx + 1, cy);
      const i01 = at(cx, cy + 1);
      const i11 = at(cx + 1, cy + 1);
      const n00 = gx[i00] * fx + gy[i00] * fy;
      const n10 = gx[i10] * (fx - 1) + gy[i10] * fy;
      const n01 = gx[i01] * fx + gy[i01] * (fy - 1);
      const n11 = gx[i11] * (fx - 1) + gy[i11] * (fy - 1);
      const nx0 = n00 + (n10 - n00) * u;
      const nx1 = n01 + (n11 - n01) * u;
      out[y * NOISE_SIZE + x] = nx0 + (nx1 - nx0) * v;
    }
  }
  for (let i = 0; i < out.length; i++) out[i] = Math.max(-1, Math.min(1, out[i] * 1.45));
  return out;
}

function noiseBytes() {
  const rand = mulberry32(0x1b1eed);
  const ch = [noiseChannel(rand), noiseChannel(rand), noiseChannel(rand), noiseChannel(rand)];
  const data = new Uint8Array(NOISE_SIZE * NOISE_SIZE * 4);
  for (let i = 0; i < NOISE_SIZE * NOISE_SIZE; i++) {
    for (let c = 0; c < 4; c++) data[i * 4 + c] = Math.round((ch[c][i] * 0.5 + 0.5) * 255);
  }
  return data;
}

let noiseCache = null; // built once, a few tens of milliseconds
export function warmInk() {
  if (!noiseCache) noiseCache = noiseBytes();
}

function compile(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`ink shader: ${log}`);
  }
  return s;
}

function farthestCorner(x, y) {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  return Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y)) + 4;
}

/**
 * Starts the ink. Returns a stop() function, or null when WebGL2 is not available.
 * `duration` is in milliseconds. The mask is empty until the first frame is drawn.
 */
export function startInkGL({ x, y, duration = 1400 }) {
  let gl;
  let canvas;
  let program;
  let tex;
  try {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const W = Math.min(vw, MASK_MAX_W);
    const scale = W / vw;
    const H = Math.max(32, Math.round(vh * scale));
    canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) return null;

    warmInk();
    program = gl.createProgram();
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('ink program link failed');
    gl.useProgram(program);
    gl.bindVertexArray(gl.createVertexArray());

    tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, NOISE_SIZE, NOISE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, noiseCache);

    const u = (n) => gl.getUniformLocation(program, n);
    const maxDist = farthestCorner(x, y);
    const seed = { x: Math.random() * 64 - 32, y: Math.random() * 64 - 32, angle: Math.random() * Math.PI * 2 };
    const cos = Math.cos(seed.angle);
    const sin = Math.sin(seed.angle);

    gl.viewport(0, 0, W, H);
    gl.uniform1i(u('uNoise'), 0);
    gl.uniform1f(u('uCanvasScale'), scale);
    gl.uniform2f(u('uRes'), W, H);
    gl.uniform2f(u('uCenter'), x, y);
    gl.uniform1f(u('uRef'), Math.max(W, H) / scale);
    gl.uniform2f(u('uSeed'), seed.x, seed.y);
    gl.uniformMatrix2fv(u('uSeedRot'), false, [cos, sin, -sin, cos]);
    gl.uniform1f(u('uTendril'), PARAMS.tendril);
    gl.uniform1f(u('uNoiseScale'), PARAMS.noiseScale);
    gl.uniform1f(u('uSoftness'), PARAMS.softness);
    gl.uniform1f(u('uDrift'), PARAMS.drift);
    const uRadius = u('uRadius');
    const uCleanup = u('uCleanup');
    const uTime = u('uTime');

    const root = document.documentElement;
    const seconds = duration / 1000;

    const push = (elapsedMs) => {
      const lin = Math.min(1, elapsedMs / duration);
      const progress = 1 - Math.pow(1 - lin, 3); // power3.out, like the original
      const ramp = Math.max(0, (lin - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom));
      const cleanup =
        Math.pow(ramp, SPREAD.cleanupPow) * maxDist * SPREAD.cleanupReach + Math.max(0, (lin - 0.97) / 0.03) * maxDist;
      gl.uniform1f(uRadius, progress * maxDist * SPREAD.growth);
      gl.uniform1f(uCleanup, cleanup);
      gl.uniform1f(uTime, lin * seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      root.style.setProperty('--ink-mask', `url(${canvas.toDataURL('image/png')})`);
    };

    push(0); // empty mask: the new snapshot stays hidden until the first real frame

    let raf = 0;
    let stopped = false;
    let begin = 0;
    const frame = (now) => {
      if (stopped) return;
      if (!begin) begin = now;
      const elapsed = Math.min(duration, now - begin);
      push(elapsed);
      if (elapsed < duration) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return function stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      root.style.removeProperty('--ink-mask');
      try {
        gl.deleteTexture(tex);
        gl.deleteProgram(program);
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      } catch (err) {
        // nothing left to clean up
      }
    };
  } catch (err) {
    return null;
  }
}
