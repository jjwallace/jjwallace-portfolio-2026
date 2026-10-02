// A scuba diver anchored to the bottom-right of the viewport : bobs slowly as if floating,
// blinks now and then, talks in a canvas-drawn speech bubble, (a small closed-eyes patch over the open-eyes image), breathes out bursts
// of bubbles from his regulator, and has a small speech bubble. Bubbles come from a fixed pool.

const DIVER_URL = new URL("../diver.webp", import.meta.url).href;
const BLINK_URL = new URL("../diver-blink.webp", import.meta.url).href;

// Source art is 480x322; the blink patch sits at this offset, the regulator at this point.
const SRC_W = 480;
const SRC_H = 322;
const BLINK_AT = { x: 161, y: 46 };
// Exhaust ports on either side of the regulator (source-art coordinates).
const EXHAUST = [{ x: 206, y: 160, dir: -1 }, { x: 268, y: 160, dir: 1 }];

const WIDTH = 300; // on-screen width on desktop, px
const WIDTH_PHONE = 150;
const MARGIN_RIGHT = 16; // gap to the right edge of the screen on phones
const MARGIN_RIGHT_DESKTOP = 100; // and on desktop
const LIFT = 0; // extra px above the bottom edge once risen
const SINK = 0; // the art's bottom edge sits on the bottom of the viewport
const BOB = 26; // px up and down
const BOB_SPEED = 0.7; // radians per second

const BLINK_MS = 140;
const BLINK_EVERY = [1200, 3200];

const BUBBLES = 60;
const BREATH_EVERY = [3200, 5200]; // ms between exhales
const PER_BREATH = [6, 10];

// Shown while the intro card is in view.
// Speech bubble layout.
const SAY_MAX_W = 230;
const SAY_PAD_X = 12;
const SAY_PAD_Y = 7;
const SAY_TAIL = 7;
const SAY_MIN_SCALE = 0.6;
const SAY_MS = 400;

const GREETING = "Hi, I'm Jesse. Welcome to my portfolio.";
// A short blurb for whichever project card is in view, keyed by the card's heading id.
const BLURBS = {
  "tink-thought-interactive-neural-kernel": "T.I.N.K. turns noisy coding agents into one calm voice.",
  pyxis: "Pyxis helps people and agents find code by meaning, not keywords.",
  "exploding-bookmarks": "Your bookmarks as a physics galaxy. Throw away the ones you don't need.",
  "trivia-bird": "Scan the QR code and play trivia live from your phone.",
  "older-projects": "My early web games, built for Nickelodeon, MTV and other publishers.",
  corporate: "Games I built for Peacock, the US Army and FOX.",
};
const ENTER_DELAY = 1800; // ms after load before he rises in
const ENTER_MS = 2600; // rise-in duration

const rand = (min, max) => Math.random() * (max - min) + min;

export async function createDiver(PIXI, renderer) {
  const [diverTex, blinkTex] = await Promise.all([PIXI.Assets.load(DIVER_URL), PIXI.Assets.load(BLINK_URL)]);

  const view = new PIXI.Container();
  const body = new PIXI.Sprite(diverTex);
  const blink = new PIXI.Sprite(blinkTex);
  blink.position.set(BLINK_AT.x, BLINK_AT.y);
  blink.visible = false;
  const diver = new PIXI.Container();
  diver.addChild(body, blink);
  diver.pivot.set(SRC_W / 2, SRC_H / 2);

  // Bubble pool: created once, reused; a free bubble is parked off screen.
  const ringTex = renderer.generateTexture(new PIXI.Graphics().circle(6, 6, 5).stroke({ width: 1.4, color: 0xffffff }));
  const fizz = new PIXI.ParticleContainer({ dynamicProperties: { position: true, vertex: true, color: true } });
  const bx = new Float32Array(BUBBLES);
  const by = new Float32Array(BUBBLES);
  const bvy = new Float32Array(BUBBLES);
  const bvx = new Float32Array(BUBBLES);
  const bWob = new Float32Array(BUBBLES);
  const bLife = new Float32Array(BUBBLES);
  const bSize = new Float32Array(BUBBLES);
  const pool = [];
  const free = [];
  for (let i = 0; i < BUBBLES; i++) {
    const p = new PIXI.Particle({ texture: ringTex, anchorX: 0.5, anchorY: 0.5, x: -100, y: -100, alpha: 0 });
    pool.push(p);
    fizz.addParticle(p);
    free.push(i);
  }
  view.addChild(diver, fizz); // bubbles drawn in front of the diver

  // Speech bubble, drawn in the canvas so dark-mode tools can't recolor it: a white rounded box
  // with a small triangle pointing down at the diver's head, and dark text.
  const say = new PIXI.Container();
  const sayBox = new PIXI.Graphics();
  const sayText = new PIXI.Text({
    text: "",
    style: {
      fontFamily: ["Sora", "Segoe UI", "system-ui", "sans-serif"],
      fontSize: 13,
      fontWeight: "600",
      fill: 0x0b1a2a,
      align: "center",
      wordWrap: true,
      wordWrapWidth: SAY_MAX_W - SAY_PAD_X * 2,
      lineHeight: 16,
    },
    resolution: Math.min(window.devicePixelRatio || 1, 2) * 2,
  });
  sayText.anchor.set(0.5, 1);
  say.addChild(sayBox, sayText);
  say.alpha = 0;
  say.scale.set(SAY_MIN_SCALE);
  view.addChild(say);
  let sayTarget = 0; // 0 hidden, 1 shown
  let sayK = 0; // animation progress 0..1
  const layoutSay = () => {
    const w = Math.ceil(sayText.width) + SAY_PAD_X * 2;
    const h = Math.ceil(sayText.height) + SAY_PAD_Y * 2;
    // Origin is the tip of the tail, so scaling grows the bubble out of his head.
    sayText.position.set(0, -SAY_TAIL - SAY_PAD_Y);
    sayBox
      .clear()
      .roundRect(-w / 2, -SAY_TAIL - h, w, h, 12)
      .fill(0xffffff)
      .poly([-8, -SAY_TAIL - 1, 8, -SAY_TAIL - 1, 0, 0])
      .fill(0xffffff);
  };

  let time = 0;
  let enterT = -ENTER_DELAY;
  let nextBlink = rand(...BLINK_EVERY);
  let blinkLeft = 0;
  let nextBreath = ENTER_DELAY + ENTER_MS;
  let breathLeft = 0;
  let breathGap = 0;

  // Speech: the greeting over the intro card, then a blurb for the project card in the middle of the screen.
  let shown = "";
  let checkT = 0;
  // Shrink the old bubble away, swap the text, grow the new one in (ease-in-out).
  let pending = null;
  const show = (text) => {
    if (text === shown) return;
    shown = text;
    pending = text;
    sayTarget = 0;
  };
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const stepSay = (deltaMS) => {
    sayK += Math.sign(sayTarget - sayK) * (deltaMS / SAY_MS);
    sayK = Math.min(1, Math.max(0, sayK));
    if (sayK === 0 && pending !== null) {
      sayText.text = pending;
      layoutSay();
      sayTarget = pending ? 1 : 0;
      pending = null;
    }
    const e = easeInOut(sayK);
    say.alpha = e;
    say.scale.set(SAY_MIN_SCALE + (1 - SAY_MIN_SCALE) * e);
  };
  const cardInView = () => {
    const mid = window.innerHeight * 0.45;
    for (const card of document.querySelectorAll(".container-lg .card:not(.intro)")) {
      const r = card.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        const h2 = card.querySelector("h2");
        // Same slug GitHub Pages uses for heading ids, in case the id is missing.
        return h2 && (h2.id || h2.textContent.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
      }
    }
    return null;
  };
  const updateSpeech = (deltaMS) => {
    checkT -= deltaMS;
    if (checkT > 0) return;
    checkT = 250;
    // Greeting at the top of the page; project blurbs once you start scrolling.
    show(window.scrollY < 150 ? GREETING : BLURBS[cardInView()] ?? "");
  };

  const scaleFor = (w) => (w < 560 ? WIDTH_PHONE : WIDTH) / SRC_W;

  return {
    view,
    step(dt, w, h, deltaMS) {
      time += deltaMS / 1000;
      const s = scaleFor(w);
      const dw = SRC_W * s;
      const dh = SRC_H * s;
      const bob = (Math.sin(time * BOB_SPEED) + 1) / 2 * BOB; // bobs downward only, so his base never leaves the bottom edge
      diver.scale.set(s);
      diver.rotation = Math.sin(time * BOB_SPEED * 0.7) * 0.025;
      // Swim in from beyond the right edge, easing to a stop.
      enterT += deltaMS;
      const k = Math.min(1, Math.max(0, enterT / ENTER_MS));
      const ease = 1 - Math.pow(1 - k, 3);
      // A fixed gap from the right edge of the screen.
      const right = w - (w >= 560 ? MARGIN_RIGHT_DESKTOP : MARGIN_RIGHT);
      // Rise in from below the bottom edge, easing to a stop.
      const offY = (1 - ease) * (dh + LIFT + 40);
      diver.position.set(right - dw / 2, h - LIFT - dh / 2 + dh * SINK + bob + offY);
      if (k >= 1) updateSpeech(deltaMS);

      // Blink: a short closed-eyes frame, sometimes twice in a row.
      nextBlink -= deltaMS;
      if (nextBlink <= 0) {
        blinkLeft = BLINK_MS;
        nextBlink = Math.random() < 0.2 ? 260 : rand(...BLINK_EVERY);
      }
      if (blinkLeft > 0) blinkLeft -= deltaMS;
      blink.visible = blinkLeft > 0;

      // Breathing: every few seconds, a short burst of bubbles from the regulator.
      nextBreath -= deltaMS;
      if (nextBreath <= 0) {
        breathLeft = Math.round(rand(...PER_BREATH));
        nextBreath = rand(...BREATH_EVERY);
      }
      breathGap -= deltaMS;
      if (k >= 0.6 && breathLeft > 0 && breathGap <= 0 && free.length) {
        const i = free.pop();
        // Alternate sides; each bubble puffs sideways out of its port, then rises.
        const port = EXHAUST[breathLeft % 2];
        const reg = diver.toGlobal({ x: port.x, y: port.y + rand(-4, 4) });
        bx[i] = reg.x;
        by[i] = reg.y;
        bvx[i] = port.dir * rand(1.2, 2.4);
        bvy[i] = rand(0.9, 1.7);
        bWob[i] = rand(0, Math.PI * 2);
        bLife[i] = 1;
        bSize[i] = rand(0.5, 1.2) * (s / (WIDTH / SRC_W));
        breathLeft--;
        breathGap = rand(40, 110);
      }
      for (let i = 0; i < BUBBLES; i++) {
        if (bLife[i] <= 0) continue;
        const p = pool[i];
        by[i] -= bvy[i] * dt;
        bx[i] += bvx[i] * dt;
        bvx[i] *= Math.pow(0.93, dt); // sideways puff slows quickly
        bWob[i] += 0.08 * dt;
        bLife[i] -= 0.0035 * dt;
        if (bLife[i] <= 0 || by[i] < -20) {
          bLife[i] = 0;
          p.x = -100;
          p.alpha = 0;
          free.push(i);
          continue;
        }
        const grow = 1 + (1 - bLife[i]) * 0.8; // bubbles expand as they rise
        p.x = bx[i] + Math.sin(bWob[i]) * 3;
        p.y = by[i];
        p.scaleX = p.scaleY = bSize[i] * grow;
        p.alpha = Math.min(1, bLife[i] * 1.5) * 0.75;
      }

      // Speech bubble sits centred above the diver's head, its tail pointing down at him.
      const head = diver.toGlobal({ x: 228, y: -14 });
      say.position.set(Math.round(head.x), Math.round(head.y));
      stepSay(deltaMS);
    },
  };
}
