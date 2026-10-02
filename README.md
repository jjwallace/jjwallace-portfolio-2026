<div class="card intro" markdown="1">

<div class="intro-logo" aria-hidden="true"><img src="assets/kraken-logo.webp" alt="" width="428" height="470"></div>

# Jesse Wallace: Portfolio 2026

Interactive web work: games, canvas rendering, physics, and AI-native tools.
15+ years shipping real-time interactive software · 41+ published web games · 2B+ plays

<p class="links"><a href="https://github.com/jjwallace">GitHub</a><a href="https://linkedin.com/in/jjwallace">LinkedIn</a></p>

</div>

<div class="card" markdown="1">

<div class="card-head" markdown="1">

<p class="eyebrow">Desktop app</p>

## T.I.N.K. (Thought Interactive Neural Kernel)

</div>

<p class="links"><a href="https://hellotink.com/">Visit hellotink.com</a><a href="https://jjwallace.github.io/tink-site/">Landing demo</a></p>

<img src="screenshots/tink-footer.webp" alt="T.I.N.K." width="100%" class="full-bleed">

A voice-and-overlay desktop companion for AI coding tools like Claude Code and Cursor. It listens to your editor and coding agents and turns their output into one calm spoken voice. "A more capable, less smug descendant of Clippy."

The landing site is a scroll-driven story in a PixiJS canvas:

- **Choreography:** three animated characters (a sphere, a glowing orb, and a tentacled creature) move in sync with scroll progress.
- **Physics:** Verlet-chain tentacle simulation for the creature.
- **Audio:** a Web Audio chirp synthesizer creates the creature's "voice" with no audio files, and Howler handles the sound effects.
- **Stack:** React, TypeScript, Vite, and Lenis smooth scrolling.

**Why it matters:** it shows an opinion on AI-assisted engineering (one calm voice instead of a noisy stream of agent output), presented through custom canvas animation and audio.

</div>

<div class="card" markdown="1">

<div class="card-head" markdown="1">

<p class="eyebrow">TypeScript library · AI tooling</p>

## Pyxis

</div>

<p class="links"><a href="https://github.com/jjwallace/pyxis">Source</a><span>npm · TypeScript · Bun</span></p>

<img loading="lazy" decoding="async" src="screenshots/pyxis.webp" alt="Pyxis" width="100%" class="full-bleed">

A semantic router for code and docs. Pyxis indexes a codebase, its docs, rules and commands, then finds the right one by meaning instead of keywords, so a person or a coding agent can ask "how does auth work" and get the file and line. Named after the mariner's compass constellation.

- **Search:** real embeddings (Nomic Embed v2) with HNSW vector search, merged with BM25 full-text into one weighted hybrid score.
- **Code parsing:** the TypeScript Compiler API pulls out functions, classes, interfaces and types, each with a path:line reference; Rust is parsed too.
- **Speed:** the index persists to disk and loads instantly, updates incrementally when a file changes, and indexes in parallel.
- **Scope:** one unified index across multiple repos.

**Why it matters:** coding agents guess when they can't find the right file. Pyxis gives them, and people, a way to find code by what it does.

</div>

<div class="card" markdown="1">

<div class="card-head" markdown="1">

<p class="eyebrow">Browser extension</p>

## Exploding Bookmarks

</div>

<p class="links"><a href="https://explodingbookmarks.com">Visit explodingbookmarks.com</a><span>Chrome · Brave · Firefox · Web demo</span></p>

<img loading="lazy" decoding="async" src="screenshots/exploding-bookmarks.webp" alt="Exploding Bookmarks" width="500">

Your browser bookmarks as a full-screen, physics-based galaxy. Folders and links become a force-directed graph you can drag, zoom, search, and reorganize. Bookmarks you don't need get thrown at the wall and explode, with an undo timer before anything is deleted.

- **Rendering:** Phaser 3 canvas with D3-force physics, particle explosion effects, and glowing links with ambient bubbles flowing along them.
- **Architecture:** monorepo of reusable packages (effects, simulation, UI overlay) shared by the Chrome extension and the web demo.
- **Real data:** reads and writes your actual bookmarks through the Chrome Bookmarks API, with changes synced back in real time.
- **Privacy:** opt-in telemetry that never collects bookmark content.

**Why it matters:** browser bookmark managers haven't changed in decades. This turns a flat list into something people can see all at once and navigate spatially.

</div>

<div class="card" markdown="1">

<div class="card-head" markdown="1">

<p class="eyebrow">Multiplayer game</p>

## Trivia Bird

</div>

<p class="links"><a href="https://triviabird.com">Play triviabird.com</a><a href="https://github.com/jjwallace/bird-trivia">Source</a></p>

<img loading="lazy" decoding="async" src="screenshots/trivia-bird.webp" alt="Trivia Bird" width="500">

A real-time multiplayer trivia game. Players scan a QR code, join from their phones, and compete live across 9 categories: animals, food, general knowledge, geography, history, movies, music, science, and space.

- **Real-time multiplayer:** Node backend with Socket.IO keeping every player in sync.
- **Game client:** Phaser 3 and React, with separate desktop (big screen) and mobile (controller) layouts.
- **Audio:** AI-generated sound effects built from prompts.

**Why it matters:** a complete multiplayer game, from server to client to audio, built and shipped by one person.

</div>

<div class="card" markdown="1">

<div class="card-head" markdown="1">

<p class="eyebrow">2008–2016 · Web games</p>

## Older Projects

</div>

Commercial web games from 2008 to 2016, published by Nickelodeon, MTV, ArmorGames, MaxGames and others. Originally shown on [my earlier portfolio site](https://jjwallace.github.io/jjwallace-website/).

<div class="game-grid">
<div class="game">
<a href="https://www.kongregate.com/en/games/jjwallace/gum-drop-hop"><img loading="lazy" decoding="async" src="screenshots/older/gumdrophop.webp" alt="Gum Drop Hop" width="100%"></a>
<h3>Gum Drop Hop</h3>
<p class="meta">MaxGames · Designer, Animator, Programmer · 21 days</p>
<p>Non-violent platformer.</p>
<p class="links"><a href="https://www.kongregate.com/en/games/jjwallace/gum-drop-hop" aria-label="Play Gum Drop Hop">Play</a></p>
</div>
<div class="game">
<a href="https://www.kongregate.com/en/games/jjwallace/wonder-rocket"><img loading="lazy" decoding="async" src="screenshots/older/wonderrocket.webp" alt="Wonder Rocket" width="100%"></a>
<h3>Wonder Rocket</h3>
<p class="meta">Nickelodeon · Designer, Animator, Programmer · 28 days</p>
<p>Upgrade-and-launch game.</p>
<p class="links"><a href="https://www.kongregate.com/en/games/jjwallace/wonder-rocket" aria-label="Play Wonder Rocket">Play</a></p>
</div>
<div class="game">
<a href="https://armorgames.com/play/4568/iron-turtle"><img loading="lazy" decoding="async" src="screenshots/older/ironturtle.webp" alt="Iron Turtle" width="100%"></a>
<h3>Iron Turtle</h3>
<p class="meta">ArmorGames · Designer, Animator, Programmer · 21 days</p>
<p>Puzzle platformer featuring a robot turtle, with springs, coins and puzzles.</p>
<p class="links"><a href="https://armorgames.com/play/4568/iron-turtle" aria-label="Play Iron Turtle">Play</a></p>
</div>
<div class="game">
<a href="https://www.addictinggames.com/funny/balls-of-life"><img loading="lazy" decoding="async" src="screenshots/older/ballsoflife.webp" alt="The Balls of Life" width="100%"></a>
<h3>The Balls of Life</h3>
<p class="meta">MTV / Nickelodeon · Designer, Animator, Programmer · 21 days</p>
<p>Platformer comedy game.</p>
<p class="links"><a href="https://www.addictinggames.com/funny/balls-of-life" aria-label="Play The Balls of Life">Play</a></p>
</div>
<div class="game">
<a href="https://www.kongregate.com/en/games/jjwallace/lost-fluid"><img loading="lazy" decoding="async" src="screenshots/older/lostfluid.webp" alt="Lost Fluid" width="100%"></a>
<h3>Lost Fluid</h3>
<p class="meta">Nickelodeon · Designer, Animator, Programmer · 21 days</p>
<p>Experimental discovery platformer: land on a distant planet and start life on it.</p>
<p class="links"><a href="https://www.kongregate.com/en/games/jjwallace/lost-fluid" aria-label="Play Lost Fluid">Play</a></p>
</div>
<div class="game">
<a href="https://www.kongregate.com/en/games/jjwallace/solar-ball"><img loading="lazy" decoding="async" src="screenshots/older/solarball.webp" alt="Solar Ball" width="100%"></a>
<h3>Solar Ball</h3>
<p class="meta">CoolBuddy · Designer, Animator, Programmer · 8 days</p>
<p>Physics puzzle game mixing pinball and pool.</p>
<p class="links"><a href="https://www.kongregate.com/en/games/jjwallace/solar-ball" aria-label="Play Solar Ball">Play</a></p>
</div>
<div class="game">
<a href="https://www.kongregate.com/en/games/jjwallace/bean-fiend"><img loading="lazy" decoding="async" src="screenshots/older/beanfiend.webp" alt="Bean Fiend" width="100%"></a>
<h3>Bean Fiend</h3>
<p class="meta">NextPlay · Designer, Animator, Programmer · 16 days</p>
<p>Platformer adventure game.</p>
<p class="links"><a href="https://www.kongregate.com/en/games/jjwallace/bean-fiend" aria-label="Play Bean Fiend">Play</a></p>
</div>
<div class="game">
<img loading="lazy" decoding="async" src="screenshots/older/nog.webp" alt="Nog" width="100%">
<h3>Nog</h3>
<p class="meta">CoolBuddy · Designer, Animator, Programmer · 14 days</p>
<p>Platformer with psychedelic themes.</p>
</div>
<div class="game">
<img loading="lazy" decoding="async" src="screenshots/older/theslob.webp" alt="The Slob" width="100%">
<h3>The Slob</h3>
<p class="meta">PlayHub · Designer, Animator, Programmer · 21 days</p>
<p>Platformer adventure game.</p>
</div>
<div class="game">
<img loading="lazy" decoding="async" src="screenshots/older/redlander.webp" alt="Red Lander" width="100%">
<h3>Red Lander</h3>
<p class="meta">Mathfort · Designer, Animator, Programmer · 3 days</p>
<p>Experimental education game.</p>
</div>
</div>

</div>

<div class="card" markdown="1">

<div class="card-head" markdown="1">

<p class="eyebrow">Brands and partners</p>

## Corporate

</div>

Games built for brands and partners.

<div class="game-grid">
<div class="game">
<a href="https://wolfgames.net"><img loading="lazy" decoding="async" src="screenshots/corporate/clue-hunter.webp" alt="Law &amp; Order: Clue Hunter" width="100%"></a>
<h3>Law &amp; Order: Clue Hunter</h3>
<p class="meta">Wolf Games · on Peacock</p>
<p>Puts Peacock viewers in the detective's seat: inspect crime scenes, identify suspects and close cases without leaving the app.</p>
<p class="links"><a href="https://wolfgames.net">Wolf Games</a></p>
</div>
<div class="game">
<img loading="lazy" decoding="async" src="screenshots/corporate/bioextract.webp" alt="Bio Extract" width="100%">
<h3>Bio Extract</h3>
<p class="meta">US Army / FOX @ MRM//McCann · Programmer · 21 days</p>
<p>Tap/click strategy game (Angular, PhaserJS): isolate mind-controlling alien microbes. Used for microbiologist recruiting.</p>
</div>
<div class="game">
<img loading="lazy" decoding="async" src="screenshots/corporate/uav.webp" alt="UAV" width="100%">
<h3>UAV</h3>
<p class="meta">US Army / FOX @ MRM//McCann · Programmer · 28 days</p>
<p>Flight simulator (Angular, PhaserJS) with pseudo-3D mechanics built for canvas rendering. Sprites come from a recycled pool, then pan, rotate and scale for effects.</p>
</div>
</div>

</div>

<p class="site-footer">COPYRIGHT © 2026 JJWALLACE™</p>
