// A school of T.I.N.K.-style fish: each is a round head with one short Verlet tentacle.
// Fish come in three sizes; larger fish hunt smaller ones, and smaller fish school with their
// own size and flee anything bigger. All state lives in typed arrays sized once at creation,
// so stepping the school allocates nothing. Used by both the rear (dark) and front (light) layers.

const NODES = 6; // tentacle links per fish
const SPACING = 0.75; // link length as a fraction of head radius
const TENTACLE_FRICTION = 0.65; // lower = less whip when the fish turns
const HEAD_LONG = 1.2; // how far the rounded nose reaches ahead, times the radius
const HEAD_SHORT = 0.8; // half-width of the body at the head, times the radius
const NOSE_SEGMENTS = 8;
const WAVE = 0.018; // sideways tail swing per link, as a fraction of head radius
const WAVE_LAG = 0.9; // phase delay per link, so the wave travels down the tail

const VIEW = 60; // schooling radius (same-size fish)
const SEPARATION = 18;
const FLEE = 90; // prey notice bigger fish at this range
const HUNT = 80; // hunters notice smaller fish at this range
const BITE = 10; // a hunter this close scatters its prey
const MIN_SPEED = 0.4;
const STEER = 0.05;
const WANDER = 0.025;
const DART_CHANCE = 0.002; // per fish per frame
const CURSOR_RADIUS = 110;
const WRAP_MARGIN = 40; // fish swim fully off screen before reappearing on the other side

// Share of the school, head radius, top speed, and opacity for each size.
export const TIERS = [
  { share: 0.7, head: [2.2, 2.8], speed: 1.6, alpha: 0.55 }, // small: prey
  { share: 0.22, head: [3.6, 4.2], speed: 1.45, alpha: 0.7 }, // medium: hunts small, flees large
  { share: 0.08, head: [5.5, 6.5], speed: 1.3, alpha: 0.85 }, // large: hunts everything smaller
];

const rand = (min, max) => Math.random() * (max - min) + min;

/**
 * @param {object} PIXI  the Pixi module
 * @param {object} opts  { count, color, alpha (multiplier), sizeScale, speedScale, shares (small, medium, large) }
 * @returns {{ view: object, step(dt, w, h, scrollShift, cursorX, cursorY): void }}
 */
export function createSchool(PIXI, { count, color = 0xffffff, alpha = 1, sizeScale = 1, speedScale = 1, shares = TIERS.map((t) => t.share) }) {
  const px = new Float32Array(count);
  const py = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const head = new Float32Array(count);
  const wander = new Float32Array(count);
  const beat = new Float32Array(count); // tail-beat phase
  const dart = new Float32Array(count);
  const tier = new Uint8Array(count);
  const nx = new Float32Array(count * NODES);
  const ny = new Float32Array(count * NODES);
  const ox = new Float32Array(count * NODES);
  const oy = new Float32Array(count * NODES);

  for (let i = 0; i < count; i++) {
    const r = i / count;
    const t = r < shares[0] ? 0 : r < shares[0] + shares[1] ? 1 : 2;
    const a = rand(0, Math.PI * 2);
    tier[i] = t;
    head[i] = rand(...TIERS[t].head) * sizeScale;
    px[i] = rand(0, window.innerWidth);
    py[i] = rand(0, window.innerHeight);
    vx[i] = Math.cos(a) * TIERS[t].speed * speedScale * 0.6;
    vy[i] = Math.sin(a) * TIERS[t].speed * speedScale * 0.6;
    wander[i] = a;
    beat[i] = rand(0, Math.PI * 2);
    for (let k = 0; k < NODES; k++) {
      nx[i * NODES + k] = ox[i * NODES + k] = px[i];
      ny[i * NODES + k] = oy[i * NODES + k] = py[i];
    }
  }

  const steer = (i, dt, cursorX, cursorY) => {
    const x = px[i];
    const y = py[i];
    const me = tier[i];
    let n = 0, ax = 0, ay = 0, mx = 0, my = 0, sx = 0, sy = 0;
    let threatX = 0, threatY = 0, threatD2 = FLEE * FLEE;
    let prey = -1, preyD2 = HUNT * HUNT;

    // A few hundred fish at most: checking every pair is cheaper than maintaining a grid.
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = px[j] - x;
      const dy = py[j] - y;
      const d2 = dx * dx + dy * dy;
      const them = tier[j];
      if (them > me) {
        if (d2 < threatD2) { threatD2 = d2; threatX = dx; threatY = dy; }
      } else if (them < me) {
        if (d2 < preyD2) { preyD2 = d2; prey = j; }
      } else if (d2 < VIEW * VIEW) {
        ax += vx[j]; ay += vy[j];
        mx += px[j]; my += py[j];
        if (d2 < SEPARATION * SEPARATION && d2 > 0) { sx -= dx / d2; sy -= dy / d2; }
        n++;
      }
    }

    let fx = 0, fy = 0;
    if (n) {
      fx += (ax / n - vx[i]) * 0.05 + (mx / n - x) * 0.001 + sx * 3;
      fy += (ay / n - vy[i]) * 0.05 + (my / n - y) * 0.001 + sy * 3;
    }

    // Wander: a slowly drifting preferred heading keeps the school from moving in straight lines.
    wander[i] += rand(-0.12, 0.12) * dt;
    fx += Math.cos(wander[i]) * WANDER;
    fy += Math.sin(wander[i]) * WANDER;

    let frightened = false;
    if (threatD2 < FLEE * FLEE) {
      const d = Math.sqrt(threatD2) || 1;
      fx -= (threatX / d) * 0.4;
      fy -= (threatY / d) * 0.4;
      dart[i] = Math.max(dart[i], 1 - d / FLEE);
      frightened = true;
    }
    if (prey >= 0 && !frightened) {
      fx += (px[prey] - x) * 0.02;
      fy += (py[prey] - y) * 0.02;
      dart[i] = Math.max(dart[i], 0.6);
      if (preyD2 < BITE * BITE) {
        // Caught up: the prey bolts.
        dart[prey] = 1;
        vx[prey] += vx[i] * 0.8;
        vy[prey] += vy[i] * 0.8;
      }
    }

    const cdx = x - cursorX;
    const cdy = y - cursorY;
    const cd2 = cdx * cdx + cdy * cdy;
    if (cd2 < CURSOR_RADIUS * CURSOR_RADIUS && cd2 > 0) {
      fx += (cdx / cd2) * 8;
      fy += (cdy / cd2) * 8;
      dart[i] = 1;
    } else if (Math.random() < DART_CHANCE) {
      dart[i] = 1;
    }

    const len = Math.hypot(fx, fy);
    const cap = STEER * (1 + dart[i] * 2);
    if (len > cap) { fx *= cap / len; fy *= cap / len; }
    const nvx = vx[i] + fx * dt;
    const nvy = vy[i] + fy * dt;
    const speed = Math.hypot(nvx, nvy) || 1;
    const top = TIERS[me].speed * speedScale * (1 + dart[i] * 1.5);
    const clamped = Math.min(top, Math.max(MIN_SPEED * speedScale, speed));
    vx[i] = (nvx * clamped) / speed;
    vy[i] = (nvy * clamped) / speed;
    dart[i] *= 0.96;
  };

  // Move the head, then let the tentacle follow: Verlet step plus a fixed-length constraint per link.
  // When the head wraps to the other edge, the whole tentacle is shifted with it.
  const move = (i, dt, w, h, scrollShift) => {
    let x = px[i] + vx[i] * dt;
    let y = py[i] + vy[i] * dt - scrollShift;
    let shiftX = 0, shiftY = -scrollShift;
    const spanX = w + WRAP_MARGIN * 2;
    const spanY = h + WRAP_MARGIN * 2;
    if (x < -WRAP_MARGIN) { x += spanX; shiftX += spanX; } else if (x >= w + WRAP_MARGIN) { x -= spanX; shiftX -= spanX; }
    while (y < -WRAP_MARGIN) { y += spanY; shiftY += spanY; }
    while (y >= h + WRAP_MARGIN) { y -= spanY; shiftY -= spanY; }
    px[i] = x;
    py[i] = y;

    const base = i * NODES;
    const r = head[i];
    const speed = Math.hypot(vx[i], vy[i]) || 1;
    const dirX = vx[i] / speed;
    const dirY = vy[i] / speed;
    nx[base] = x; // the tail starts at the head's center, inside the body outline
    ny[base] = y;
    const link = SPACING * r;
    // Tail beat: a sideways swing that travels down the tail, faster and wider at speed.
    beat[i] += (0.06 + speed * 0.04) * dt;
    const swing = WAVE * r * Math.min(1, speed);
    for (let k = 1; k < NODES; k++) {
      const n = base + k;
      if (shiftX || shiftY) { nx[n] += shiftX; ny[n] += shiftY; ox[n] += shiftX; oy[n] += shiftY; }
      const cx = nx[n];
      const cy = ny[n];
      nx[n] += (cx - ox[n]) * TENTACLE_FRICTION;
      ny[n] += (cy - oy[n]) * TENTACLE_FRICTION;
      ox[n] = cx;
      oy[n] = cy;
      const sway = Math.sin(beat[i] - k * WAVE_LAG) * swing * (k / NODES);
      nx[n] -= dirY * sway;
      ny[n] += dirX * sway;
      const dx = nx[n] - nx[n - 1];
      const dy = ny[n] - ny[n - 1];
      const d = Math.hypot(dx, dy) || 1;
      nx[n] = nx[n - 1] + (dx / d) * link;
      ny[n] = ny[n - 1] + (dy / d) * link;
    }
  };

  // Each fish is one closed shape: a rounded, oval nose in front of the head that tapers back
  // along the tail to a point. One outline means nothing overlaps.
  const draw = (g, i) => {
    const base = i * NODES;
    const r = head[i];
    const speed = Math.hypot(vx[i], vy[i]) || 1;
    const dx = vx[i] / speed; // swim direction
    const dy = vy[i] / speed;
    const w0 = r * HEAD_SHORT; // half-width at the widest point
    const nose = r * HEAD_LONG; // how far the rounded nose reaches ahead
    // Nose: half an ellipse from the left side, around the front, to the right side.
    for (let k = 0; k <= NOSE_SEGMENTS; k++) {
      const t = Math.PI / 2 - (k / NOSE_SEGMENTS) * Math.PI;
      const fx = Math.cos(t) * nose;
      const sx = Math.sin(t) * w0;
      const hx = px[i] + dx * fx - dy * sx;
      const hy = py[i] + dy * fx + dx * sx;
      if (k === 0) g.moveTo(hx, hy);
      else g.lineTo(hx, hy);
    }
    // Down the right side of the tail to the tip, then back up the left side.
    const half = (k) => w0 * (1 - k / (NODES - 1));
    const side = (k, s) => {
      const bx = nx[base + k + 1] - nx[base + k];
      const by = ny[base + k + 1] - ny[base + k];
      const bl = Math.hypot(bx, by) || 1;
      g.lineTo(nx[base + k] - (by / bl) * half(k) * s, ny[base + k] + (bx / bl) * half(k) * s);
    };
    for (let k = 1; k < NODES - 1; k++) side(k, 1);
    g.lineTo(nx[base + NODES - 1], ny[base + NODES - 1]);
    for (let k = NODES - 2; k >= 1; k--) side(k, -1);
    g.closePath().fill({ color, alpha: TIERS[tier[i]].alpha * alpha });
  };

  const view = new PIXI.Graphics();
  return {
    view,
    step(dt, w, h, scrollShift, cursorX, cursorY) {
      for (let i = 0; i < count; i++) steer(i, dt, cursorX, cursorY);
      view.clear();
      for (let i = 0; i < count; i++) {
        move(i, dt, w, h, scrollShift);
        draw(view, i);
      }
    },
  };
}
