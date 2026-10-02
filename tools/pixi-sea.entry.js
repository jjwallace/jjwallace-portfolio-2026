// Entry for the trimmed PixiJS bundle used by assets/sea. Exports only what the sea modules use.
// Rebuild (from a scratch folder with pixi.js@8.22.0 and esbuild installed):
//   npx esbuild pixi-sea.entry.js --bundle --minify --format=esm --outfile=assets/vendor/pixi-sea.min.mjs
export {
  Application, Assets, AnimatedSprite, Graphics, Container,
  ParticleContainer, Particle, Texture, BlurFilter, FillGradient,
} from "pixi.js";
