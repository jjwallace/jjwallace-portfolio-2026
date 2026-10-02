import { createSchool } from "./school.js";

const PIXI_URL = new URL("../vendor/pixi-sea.min.mjs", import.meta.url).href; // trimmed PixiJS 8.22, see tools/
const ATLAS_URL = new URL("../sprites/sea-life.json", import.meta.url).href;

const SWIM_SPEED = 0.5; // 30fps atlas played on a 60fps ticker
const WRAP_MARGIN = 120;
const ZAP_RADIUS = 70;
// Rear school: 140 small, 88 medium, 32 large (half the small fish of the default mix).
const REAR_FISH = 260;
const REAR_SHARES = [140 / 260, 88 / 260, 32 / 260];
const REAR_FISH_DEPTH = 0.2;

// Light rays from the surface above: near-vertical shafts that tilt slightly outward the further
// they are from the center, each glowing softly and fading in and out on its own cycle.
const RAYS = 28;
const RAY_TILT = 0.18; // radians of outward tilt at the screen edges
const RAY_ALPHA = 0.1;
const RAY_LIFE_MS = [1500, 3000];
const RAY_FADE_SCROLL = 2500; // px of scrolling over which the rays dim to 30%

const rand = (min, max) => Math.random() * (max - min) + min;

// Depth layers: far ones scroll slower than the page (parallax), as in the old site's dark/light schools.
// Rear jellyfish are half-transparent black silhouettes; front jellyfish keep their colors.
// Each layer's sprites are created once and recycled by wrapping around the screen (a fixed pool).
const LAYERS = [
  { depth: [0.08, 0.4], perScreen: 40, scale: [0.5, 1.0], tint: 0x000000, alpha: 0.5 },
  { depth: [0.6, 0.6], perScreen: 20, scale: [0.75, 1.0], tint: 0xffffff, alpha: 1 },
];

// The content card covers the sea on narrow screens, so don't spend battery animating hidden sprites.
const hasVisibleMargins = () => {
  const card = document.querySelector(".container-lg");
  return !card || (window.innerWidth - card.offsetWidth) / 2 >= 60;
};

async function start() {
  if (!hasVisibleMargins()) return;
  const PIXI = await import(PIXI_URL);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const app = new PIXI.Application();
  await app.init({
    resizeTo: window,
    backgroundAlpha: 0,
    antialias: false,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });
  app.canvas.id = "sea";
  app.canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(app.canvas);

  const sheet = await PIXI.Assets.load(ATLAS_URL);
  const { jellyfish: swim, "jellyfish-shock": shock } = sheet.animations;

  const layers = LAYERS.map((cfg) => {
    const layer = new PIXI.Container();
    layer.cfg = cfg;
    layer.fish = [];
    const count = cfg.perScreen;
    for (let i = 0; i < count; i++) {
      const s = new PIXI.AnimatedSprite(swim);
      const size = rand(...cfg.scale);
      s.anchor.set(0.5);
      s.scale.set(size);
      s.speed = size;
      s.angle = rand(-180, 180);
      s.tint = cfg.tint;
      s.alpha = cfg.alpha;
      s.animationSpeed = SWIM_SPEED;
      s.x = rand(0, window.innerWidth);
      s.y = rand(0, window.innerHeight);
      // Parallax by size: smaller jellyfish read as farther away, so they scroll slower.
      const near = (size - cfg.scale[0]) / (cfg.scale[1] - cfg.scale[0] || 1);
      s.depth = cfg.depth[0] + (cfg.depth[1] - cfg.depth[0]) * near;
      s.gotoAndPlay(Math.floor(rand(0, swim.length)));
      layer.addChild(s);
      layer.fish.push(s);
    }
    app.stage.addChild(layer);
    return layer;
  });

  // God rays: each shaft lives for a while (gentle fade in, hold, fade out), then reappears
  // somewhere else with a new width. A blur makes them glow. Drawn first so everything swims in front.
  const rays = new PIXI.Graphics();
  rays.filters = [new PIXI.BlurFilter({ strength: 6, quality: 3, resolution: 0.5 })];
  app.stage.addChildAt(rays, 0);
  const rayGradient = new PIXI.FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    textureSpace: "local",
    colorStops: [
      { offset: 0, color: "rgba(110,225,255,1)" },
      { offset: 0.6, color: "rgba(80,205,240,0.55)" },
      { offset: 1, color: "rgba(60,190,230,0)" },
    ],
  });
  const rayX = new Float32Array(RAYS); // 0..1 across the screen at the top edge
  const rayWidth = new Float32Array(RAYS);
  const rayAge = new Float32Array(RAYS);
  const rayLife = new Float32Array(RAYS);
  const resetRay = (i) => {
    rayX[i] = rand(-0.02, 1.02); // full width, including the side margins
    rayWidth[i] = rand(10, 36);
    rayAge[i] = 0;
    rayLife[i] = rand(...RAY_LIFE_MS);
  };
  for (let i = 0; i < RAYS; i++) {
    resetRay(i);
    rayAge[i] = rand(0, rayLife[i]); // stagger so they don't all fade together
  }
  const drawRays = (deltaMS = 0) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const depthFade = Math.max(0.3, 1 - window.scrollY / RAY_FADE_SCROLL);
    rays.clear();
    for (let i = 0; i < RAYS; i++) {
      rayAge[i] += deltaMS;
      if (rayAge[i] >= rayLife[i]) resetRay(i);
      const t = rayAge[i] / rayLife[i];
      const fade = Math.sin(Math.PI * t) ** 2; // smooth in and out
      const x0 = rayX[i] * w;
      const tilt = (rayX[i] - 0.5) * 2 * RAY_TILT;
      const top = rayWidth[i];
      const bottom = top * 1.8;
      const x1 = x0 + Math.tan(tilt) * h;
      rays
        .poly([x0 - top / 2, -20, x0 + top / 2, -20, x1 + bottom / 2, h, x1 - bottom / 2, h])
        .fill({ fill: rayGradient, alpha: RAY_ALPHA * fade * depthFade });
    }
  };
  drawRays();

  // A large dark school of tentacled fish swims between the rear and front jellyfish.
  const school = createSchool(PIXI, { count: REAR_FISH, color: 0x000000, alpha: 0.6, sizeScale: 1.05, speedScale: 0.8, shares: REAR_SHARES });
  app.stage.addChildAt(school.view, 1);
  let cursorX = -1e4;
  let cursorY = -1e4;
  let lastScroll = window.scrollY;

  const zap = (s) => {
    if (s.zapping) return;
    s.zapping = true;
    s.textures = shock;
    s.loop = false;
    s.onComplete = () => {
      s.textures = swim;
      s.loop = true;
      s.onComplete = null;
      s.zapping = false;
      s.play();
    };
    s.gotoAndPlay(0);
  };

  window.addEventListener("pointermove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    const front = layers[layers.length - 1];
    for (const s of front.fish) {
      const dx = s.x - e.clientX;
      const dy = s.y - e.clientY;
      if (dx * dx + dy * dy < ZAP_RADIUS * ZAP_RADIUS) zap(s);
    }
  }, { passive: true });

  const wrap = (s, layer) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const top = -WRAP_MARGIN;
    const spanY = h + WRAP_MARGIN * 2;
    const spanX = w + WRAP_MARGIN * 2;
    if (s.x < -WRAP_MARGIN) s.x += spanX;
    else if (s.x > w + WRAP_MARGIN) s.x -= spanX;
    if (s.y < top) s.y += spanY;
    else if (s.y > top + spanY) s.y -= spanY;
  };

  let jellyScroll = window.scrollY;
  const placeLayers = () => {
    const delta = window.scrollY - jellyScroll;
    jellyScroll = window.scrollY;
    for (const layer of layers) {
      for (const s of layer.fish) {
        s.y -= delta * s.depth;
        wrap(s, layer);
      }
    }
  };
  placeLayers();

  if (reduceMotion) {
    for (const layer of layers) for (const s of layer.fish) s.stop();
    app.ticker.stop();
    school.step(0, window.innerWidth, window.innerHeight, 0, cursorX, cursorY);
    app.render();
    window.addEventListener("resize", () => { drawRays(); app.render(); });
    return;
  }

  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime;
    for (const layer of layers) {
      for (const s of layer.fish) {
        const rad = (s.angle * Math.PI) / 180;
        s.x -= Math.cos(rad) * s.speed * dt;
        s.y -= Math.sin(rad) * s.speed * dt;
      }
    }
    placeLayers();
    drawRays(ticker.deltaMS);
    const scrollShift = (window.scrollY - lastScroll) * REAR_FISH_DEPTH;
    lastScroll = window.scrollY;
    school.step(Math.min(dt, 3), window.innerWidth, window.innerHeight, scrollShift, cursorX, cursorY);
  });
}

const boot = () => start().catch((err) => console.warn("sea-life overlay disabled:", err));
if (document.readyState === "complete") boot();
else window.addEventListener("load", boot);
