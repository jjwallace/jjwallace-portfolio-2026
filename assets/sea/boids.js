// Top layer: a small school of tentacled fish, rising bubbles, and the seahorse on their own
// transparent canvas above the page. Bubbles come from a fixed entity pool and fish state lives in
// typed arrays, so the simulation allocates nothing per frame. The canvas starts black and fades
// to reveal the site.
import { createSchool } from "./school.js";
import { createTink } from "./tink.js";

const PIXI_URL = new URL("../vendor/pixi-sea.min.mjs", import.meta.url).href; // trimmed PixiJS 8.22, see tools/
const ATLAS_URL = new URL("../sprites/sea-life.json", import.meta.url).href;

const FISH = 15;
const CURSOR_OFF = -1e4;
const SCROLL_DEPTH = 1; // 1 = the layer moves with the page

// Ambient bubbles rise from the bottom of the screen all the way to the top.
const MAX_BUBBLES = 220;
const BUBBLE_RATE = 0.15; // new bubbles per frame
const BUBBLE_ALPHA = [0.06, 0.18];

const INTRO_MS = 1600;
const INTRO_CAP_MS = 1500; // matches the CSS cover's fallback delay
const SWIM_SPEED = 0.5;
const HORSE_SCALE = 1.2;

const rand = (min, max) => Math.random() * (max - min) + min;
const root = document.documentElement;
const reveal = () => root.classList.add("sea-ready");

async function start() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return reveal();
  const PIXI = await import(PIXI_URL);

  const app = new PIXI.Application();
  await app.init({
    resizeTo: window,
    backgroundAlpha: 0,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });
  app.canvas.id = "boids";
  app.canvas.setAttribute("aria-hidden", "true");
  document.body.append(app.canvas);

  // Black veil: the canvas takes over from the CSS cover, then fades out.
  const veil = new PIXI.Graphics().rect(0, 0, 1, 1).fill(0x000000);
  // On slow connections the CSS cover has already faded by itself (after 1.5 s); don't go black again.
  if (performance.now() > INTRO_CAP_MS) veil.visible = false;
  const fitVeil = () => veil.scale.set(window.innerWidth, window.innerHeight);
  fitVeil();
  window.addEventListener("resize", fitVeil);

  const bubbleTexture = app.renderer.generateTexture(
    new PIXI.Graphics().circle(4, 4, 3).stroke({ width: 1, color: 0xffffff }),
  );
  const fizz = new PIXI.ParticleContainer({ dynamicProperties: { position: true } });
  const school = createSchool(PIXI, { count: FISH, sizeScale: 1.7 });
  const tink = createTink(PIXI);
  app.stage.addChild(fizz, school.view, tink.view);

  // ── Bubble entity pool ──────────────────────────────────────────────
  const bx = new Float32Array(MAX_BUBBLES);
  const by = new Float32Array(MAX_BUBBLES);
  const bvy = new Float32Array(MAX_BUBBLES);
  const bWobble = new Float32Array(MAX_BUBBLES);
  const bLive = new Uint8Array(MAX_BUBBLES);
  const bubbles = [];
  const freeBubbles = new Int32Array(MAX_BUBBLES);
  let freeCount = MAX_BUBBLES;
  for (let i = 0; i < MAX_BUBBLES; i++) {
    const size = rand(0.35, 1);
    const b = new PIXI.Particle({ texture: bubbleTexture, anchorX: 0.5, anchorY: 0.5, scaleX: size, scaleY: size, alpha: rand(...BUBBLE_ALPHA) });
    bubbles.push(b);
    fizz.addParticle(b);
    freeBubbles[i] = MAX_BUBBLES - 1 - i;
  }
  const releaseBubble = (i) => {
    bLive[i] = 0;
    bubbles[i].x = -100; // parked off screen until reused
    freeBubbles[freeCount++] = i;
  };
  for (let i = 0; i < MAX_BUBBLES; i++) bubbles[i].x = -100;
  const emitBubble = (y) => {
    if (!freeCount) return;
    const i = freeBubbles[--freeCount];
    bLive[i] = 1;
    bx[i] = rand(0, window.innerWidth);
    by[i] = y;
    bvy[i] = rand(0.4, 1.2);
    bWobble[i] = rand(0, Math.PI * 2);
  };
  // Start with the column already full so the screen isn't empty while the first bubbles rise.
  for (let i = 0; i < MAX_BUBBLES * 0.6; i++) emitBubble(rand(0, window.innerHeight));
  let bubbleDebt = 0;

  // ── Seahorse ────────────────────────────────────────────────────────
  const sheet = await PIXI.Assets.load(ATLAS_URL);
  const horse = new PIXI.AnimatedSprite(sheet.animations.seahorse);
  horse.anchor.set(0.5);
  horse.scale.set(HORSE_SCALE);
  horse.animationSpeed = SWIM_SPEED;
  horse.position.set(-40, window.innerHeight * 0.7);
  horse.play();
  app.stage.addChild(horse, veil);
  let trip = null;
  const newTrip = () => {
    const to = { x: rand(60, window.innerWidth - 60), y: rand(80, window.innerHeight - 80) };
    const from = { x: horse.x, y: horse.y };
    const ms = (Math.abs(to.x - from.x) + Math.abs(to.y - from.y)) * 10;
    horse.scale.x = to.x < from.x ? HORSE_SCALE : -HORSE_SCALE;
    trip = { from, to, ms, t: 0 };
  };
  newTrip();
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let cursorX = CURSOR_OFF;
  let cursorY = CURSOR_OFF;
  window.addEventListener("pointermove", (e) => { cursorX = e.clientX; cursorY = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { cursorX = cursorY = CURSOR_OFF; });

  let lastScroll = window.scrollY;
  let introMs = 0;

  app.ticker.add((ticker) => {
    const dt = Math.min(ticker.deltaTime, 3);
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scrolling carries the whole layer with the page; wrapping refills the screen.
    const scrollShift = (window.scrollY - lastScroll) * SCROLL_DEPTH;
    lastScroll = window.scrollY;

    if (veil.visible) {
      introMs += ticker.deltaMS;
      veil.alpha = 1 - Math.min(introMs / INTRO_MS, 1);
      if (veil.alpha <= 0) veil.visible = false;
    }

    school.step(dt, w, h, scrollShift, cursorX, cursorY);
    tink.step(dt, w, h, scrollShift);

    bubbleDebt += BUBBLE_RATE * dt;
    while (bubbleDebt >= 1) { emitBubble(h + 10); bubbleDebt--; }
    for (let i = 0; i < MAX_BUBBLES; i++) {
      if (!bLive[i]) continue;
      by[i] -= bvy[i] * dt + scrollShift;
      if (by[i] < -10 || by[i] > h + 60) { releaseBubble(i); continue; }
      bWobble[i] += 0.05 * dt;
      bubbles[i].x = bx[i] + Math.sin(bWobble[i]) * 3;
      bubbles[i].y = by[i];
    }

    trip.t += ticker.deltaMS;
    const k = easeInOutCubic(Math.min(trip.t / trip.ms, 1));
    trip.from.y -= scrollShift;
    trip.to.y -= scrollShift;
    horse.x = trip.from.x + (trip.to.x - trip.from.x) * k;
    horse.y = trip.from.y + (trip.to.y - trip.from.y) * k;
    if (trip.to.y < -60 || trip.to.y > h + 60) {
      // Scrolled off screen: swim back in from the side.
      horse.position.set(horse.scale.x > 0 ? w + 40 : -40, rand(80, h - 80));
      newTrip();
    } else if (trip.t >= trip.ms) {
      newTrip();
    }
  });

  // Hand over from the CSS cover once the black veil has been drawn.
  app.ticker.addOnce(() => requestAnimationFrame(reveal));

  document.addEventListener("visibilitychange", () => (document.hidden ? app.ticker.stop() : app.ticker.start()));
}

start().catch((err) => {
  reveal();
  console.warn("fish overlay disabled:", err);
});
