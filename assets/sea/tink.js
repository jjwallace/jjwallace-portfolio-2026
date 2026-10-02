// A lightweight T.I.N.K.: a white head with eyes, a ring of Verlet tentacles, and a sparkle trail.
// It scrolls with the page and swims fast back into view when scrolled off screen; its tentacles
// trail loosely behind it. It swims like a boid: a wandering heading, a loose pull toward the cursor that keeps a little
// distance and circles it, and a soft push away from the screen edges. Without a mouse (or when it's
// idle) it just roams. Tentacle and particle state live in typed arrays sized once.

const SCALE = 1.6;
const HEAD_RADIUS = 3.635;
const THICKNESS = 2.369;
const LENGTH = 12.286;
const FRICTION = 0.04; // much lower than the original 0.181 so tentacles keep momentum and keep moving
const SWAY = 0.12; // a slow sideways push on each tentacle node so the legs drift even when T.I.N.K. is still
const TENTACLES = 8;
const MAX_NODES = 16;

const PARTICLES = 300; // ring buffer
const EMIT_PER_FRAME = 2;
const PARTICLE_DECAY = 1 / 75;

const IDLE_MS = 4000;

// Swimming
const MAX_SPEED = 3;
const MIN_SPEED = 0.7;
const DRAG = 0.985;
const WANDER = 0.07;
const WANDER_TURN = 0.22; // radians per frame of random heading drift
const CURSOR_RANGE = 140; // preferred distance from the cursor
const CURSOR_PULL = 0.0015;
const CURSOR_PULL_MAX = 0.14;
const CURSOR_ORBIT = 0.035;
const CURSOR_PERSONAL_SPACE = 0.08;
const EDGE = 90; // px from the edge where it starts turning back
const EDGE_PUSH = 0.08;
const HOME_PULL = 0.0003; // drift toward the middle when roaming
const RETURN_PULL = 0.3; // when scrolled off screen, steer back this hard...
const RETURN_SPEED = 9; // ...and swim this fast
const OFFSCREEN = 30; // px past the edge that counts as off screen

const rand = (min, max) => Math.random() * (max - min) + min;

export function createTink(PIXI) {
  // Tentacles: per-tentacle shape, then node buffers (current, previous, velocity).
  const len = new Uint8Array(TENTACLES);
  const radius = new Float32Array(TENTACLES);
  const spacing = new Float32Array(TENTACLES);
  const fric = new Float32Array(TENTACLES);
  const nx = new Float32Array(TENTACLES * MAX_NODES);
  const ny = new Float32Array(TENTACLES * MAX_NODES);
  const ox = new Float32Array(TENTACLES * MAX_NODES);
  const oy = new Float32Array(TENTACLES * MAX_NODES);
  const nvx = new Float32Array(TENTACLES * MAX_NODES);
  const nvy = new Float32Array(TENTACLES * MAX_NODES);

  let cx = window.innerWidth * 0.75;
  let cy = window.innerHeight * 0.4;
  let vx = rand(-1, 1);
  let vy = rand(-1, 1);
  let heading = rand(0, Math.PI * 2);
  let orbitDir = Math.random() < 0.5 ? 1 : -1;
  let swayTime = 0;
  for (let t = 0; t < TENTACLES; t++) {
    len[t] = Math.floor(rand(10, 16));
    radius[t] = rand(0.8, 0.9); // nearly uniform thickness
    spacing[t] = rand(0.2, 1);
    fric[t] = rand(0.88, 0.96);
    for (let k = 0; k < MAX_NODES; k++) {
      const n = t * MAX_NODES + k;
      nx[n] = ox[n] = cx;
      ny[n] = oy[n] = cy;
    }
  }

  // Sparkle trail: a ring buffer; the oldest particle is overwritten when full.
  const px = new Float32Array(PARTICLES);
  const py = new Float32Array(PARTICLES);
  const pvx = new Float32Array(PARTICLES);
  const pvy = new Float32Array(PARTICLES);
  const life = new Float32Array(PARTICLES);
  let ring = 0;
  const emit = (x, y, vx, vy) => {
    const i = ring++ % PARTICLES;
    px[i] = x;
    py[i] = y;
    pvx[i] = vx * 0.25 + rand(-0.35, 0.35);
    pvy[i] = vy * 0.25 + rand(-0.35, 0.35);
    life[i] = 1;
  };

  let mouseX = cx;
  let mouseY = cy;
  let lastMove = -Infinity;
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMove = performance.now();
  }, { passive: true });

  const headR = (HEAD_RADIUS + THICKNESS) * SCALE;
  const view = new PIXI.Graphics();

  // Each link is a round-capped stroke that thins toward the tip. Strokes can't fold over themselves
  // on tight bends the way a filled outline does.
  const drawTentacle = (t) => {
    const base = t * MAX_NODES;
    const L = len[t];
    const root = radius[t] * THICKNESS * SCALE * 2;
    for (let k = 1; k < L; k++) {
      const width = Math.max(0.6, root * (1 - (k - 1) / L));
      view
        .moveTo(nx[base + k - 1], ny[base + k - 1])
        .lineTo(nx[base + k], ny[base + k])
        .stroke({ width, color: 0xffffff, cap: "round" });
    }
  };

  return {
    view,
    step(dt, w, h, scrollShift = 0) {
      // Scrolling carries T.I.N.K., its tentacles and its sparkles with the page.
      if (scrollShift) {
        cy -= scrollShift;
        for (let n = 0; n < TENTACLES * MAX_NODES; n++) { ny[n] -= scrollShift; oy[n] -= scrollShift; }
        for (let i = 0; i < PARTICLES; i++) py[i] -= scrollShift;
      }
      const offscreen = cx < -OFFSCREEN || cx > w + OFFSCREEN || cy < -OFFSCREEN || cy > h + OFFSCREEN;

      swayTime += dt / 60;
      let fx = 0;
      let fy = 0;

      // Wander: the preferred heading drifts randomly.
      heading += rand(-WANDER_TURN, WANDER_TURN) * dt;
      fx += Math.cos(heading) * WANDER;
      fy += Math.sin(heading) * WANDER;

      const following = performance.now() - lastMove < IDLE_MS;
      if (offscreen) {
        // Scrolled out of view: swim straight back in, fast.
        const tx = Math.min(w - EDGE, Math.max(EDGE, cx));
        const ty = Math.min(h - EDGE, Math.max(EDGE, cy));
        const d = Math.hypot(tx - cx, ty - cy) || 1;
        fx = ((tx - cx) / d) * RETURN_PULL;
        fy = ((ty - cy) / d) * RETURN_PULL;
      } else if (following) {
        // Loosely flock with the cursor: come closer when far, circle it, and keep some space.
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const d = Math.hypot(dx, dy) || 1;
        const ux = dx / d;
        const uy = dy / d;
        if (d > CURSOR_RANGE) {
          const pull = Math.min(CURSOR_PULL_MAX, (d - CURSOR_RANGE) * CURSOR_PULL);
          fx += ux * pull;
          fy += uy * pull;
        } else if (d < CURSOR_RANGE * 0.5) {
          fx -= ux * CURSOR_PERSONAL_SPACE;
          fy -= uy * CURSOR_PERSONAL_SPACE;
        }
        fx += -uy * CURSOR_ORBIT * orbitDir;
        fy += ux * CURSOR_ORBIT * orbitDir;
        if (Math.random() < 0.002 * dt) orbitDir = -orbitDir;
      } else {
        fx += (w / 2 - cx) * HOME_PULL;
        fy += (h / 2 - cy) * HOME_PULL;
      }

      // Turn back before reaching the screen edges.
      if (cx < EDGE) fx += EDGE_PUSH * (1 - cx / EDGE);
      else if (cx > w - EDGE) fx -= EDGE_PUSH * (1 - (w - cx) / EDGE);
      if (cy < EDGE) fy += EDGE_PUSH * (1 - cy / EDGE);
      else if (cy > h - EDGE) fy -= EDGE_PUSH * (1 - (h - cy) / EDGE);

      vx = (vx + fx * dt) * DRAG;
      vy = (vy + fy * dt) * DRAG;
      const speed = Math.hypot(vx, vy) || 1;
      const clamped = Math.min(offscreen ? RETURN_SPEED : MAX_SPEED, Math.max(MIN_SPEED, speed));
      vx *= clamped / speed;
      vy *= clamped / speed;
      cx += vx * dt;
      cy += vy * dt;

      // Tentacles: roots spaced around the head, then Verlet with a fixed link length.
      for (let t = 0; t < TENTACLES; t++) {
        const base = t * MAX_NODES;
        const th = (t / TENTACLES) * Math.PI * 2;
        nx[base] = cx + Math.cos(th) * HEAD_RADIUS * SCALE;
        ny[base] = cy + Math.sin(th) * HEAD_RADIUS * SCALE;
        const link = spacing[t] * LENGTH * SCALE;
        for (let k = 1; k < len[t]; k++) {
          const n = base + k;
          nx[n] += nvx[n];
          ny[n] += nvy[n];
          const a = Math.atan2(ny[n - 1] - ny[n], nx[n - 1] - nx[n]);
          nx[n] = nx[n - 1] - Math.cos(a) * link;
          ny[n] = ny[n - 1] - Math.sin(a) * link;
          // Each node gets a slow, out-of-phase sway so the legs keep curling and drifting.
          const sway = Math.sin(swayTime * 1.3 + t * 1.7 + k * 0.45) * SWAY * (k / len[t]);
          nvx[n] = (nx[n] - ox[n]) * fric[t] * (1 - FRICTION) + Math.cos(t * 0.52) * sway;
          nvy[n] = (ny[n] - oy[n]) * fric[t] * (1 - FRICTION) + Math.sin(t * 0.52) * sway;
          ox[n] = nx[n];
          oy[n] = ny[n];
        }
      }

      // Sparkles shed from the outer half of random tentacles.
      for (let e = 0; e < EMIT_PER_FRAME; e++) {
        const t = (Math.random() * TENTACLES) | 0;
        const k = Math.min(len[t] - 1, Math.floor(len[t] * (0.5 + Math.random() * 0.5)));
        const n = t * MAX_NODES + k;
        emit(nx[n], ny[n], nvx[n], nvy[n]);
      }

      view.clear();
      for (let i = 0; i < PARTICLES; i++) {
        if (life[i] <= 0) continue;
        life[i] -= PARTICLE_DECAY * dt;
        pvx[i] *= 0.96;
        pvy[i] *= 0.96;
        px[i] += pvx[i] * dt;
        py[i] += pvy[i] * dt;
        if (life[i] > 0.03) view.rect(px[i], py[i], 1, 1).fill({ color: 0xffffff, alpha: life[i] * 0.8 });
      }
      for (let t = 0; t < TENTACLES; t++) drawTentacle(t);

      // Head.
      view.circle(cx, cy, headR).fill({ color: 0xffffff });
    },
  };
}
