# Jesse Wallace: Portfolio 2026

Interactive web work: games, canvas rendering, physics, and AI-native tools.
15+ years shipping real-time interactive software · 41+ published web games · 2B+ plays

[GitHub](https://github.com/jjwallace) · [LinkedIn](https://linkedin.com/in/jjwallace)

---

## Exploding Bookmarks
**Live:** [explodingbookmarks.com](https://explodingbookmarks.com) · Browser extension (Chrome, Brave, Firefox) + standalone web demo

<img src="screenshots/exploding-bookmarks.webp" alt="Exploding Bookmarks" width="500">

Your browser bookmarks as a full-screen, physics-based galaxy. Folders and links become a force-directed graph you can drag, zoom, search, and reorganize. Bookmarks you don't need get thrown at the wall and explode, with an undo timer before anything is deleted.

- **Rendering:** Phaser 3 canvas with D3-force physics, particle explosion effects, and glowing links with ambient bubbles flowing along them.
- **Architecture:** monorepo of reusable packages (effects, simulation, UI overlay) shared by the Chrome extension and the web demo.
- **Real data:** reads and writes your actual bookmarks through the Chrome Bookmarks API, with changes synced back in real time.
- **Privacy:** opt-in telemetry that never collects bookmark content.

**Why it matters:** browser bookmark managers haven't changed in decades. This turns a flat list into something people can see all at once and navigate spatially.

---

## Trivia Bird
**Live:** [triviabird.com](https://triviabird.com) · Source: [github.com/jjwallace/bird-trivia](https://github.com/jjwallace/bird-trivia)

<img src="screenshots/trivia-bird.webp" alt="Trivia Bird" width="500">

A real-time multiplayer trivia game. Players scan a QR code, join from their phones, and compete live across 9 categories: animals, food, general knowledge, geography, history, movies, music, science, and space.

- **Real-time multiplayer:** Node backend with Socket.IO keeping every player in sync.
- **Game client:** Phaser 3 and React, with separate desktop (big screen) and mobile (controller) layouts.
- **Audio:** AI-generated sound effects built from prompts.

**Why it matters:** a complete multiplayer game, from server to client to audio, built and shipped by one person.

---

## T.I.N.K. (Thought Interactive Neural Kernel)
**Live:** [jjwallace.github.io/tink-site](https://jjwallace.github.io/tink-site/) · Source: [github.com/jjwallace/tink-site](https://github.com/jjwallace/tink-site)

<img src="screenshots/tink.webp" alt="T.I.N.K." width="500">

A voice-and-overlay desktop companion for AI coding tools like Claude Code and Cursor. It listens to your editor and coding agents and turns their output into one calm spoken voice. "A more capable, less smug descendant of Clippy."

The landing site is a scroll-driven story in a PixiJS canvas:
- **Choreography:** three animated characters (a sphere, a glowing orb, and a tentacled creature) move in sync with scroll progress.
- **Physics:** Verlet-chain tentacle simulation for the creature.
- **Audio:** a Web Audio chirp synthesizer creates the creature's "voice" with no audio files, and Howler handles the sound effects.
- **Stack:** React, TypeScript, Vite, and Lenis smooth scrolling.

**Why it matters:** it shows an opinion on AI-assisted engineering (one calm voice instead of a noisy stream of agent output), presented through custom canvas animation and audio.

---

## Older Projects

Commercial web games from 2008 to 2017, published by Nickelodeon, MTV, ArmorGames, MaxGames and others, plus games for the US Army with FOX at MRM//McCann. Originally shown on [my earlier portfolio site](https://jjwallace.github.io/jjwallace-website/).

| | Project |
|---|---|
| <img src="screenshots/older/bioextract.webp" alt="Bio Extract" width="250"> | **Bio Extract**<br>US Army / FOX @ MRM//McCann · Programmer · 21 days<br>Tap/click strategy game (Angular, PhaserJS): isolate mind-controlling alien microbes. Used for microbiologist recruiting. |
| <img src="screenshots/older/uav.webp" alt="UAV" width="250"> | **UAV**<br>US Army / FOX @ MRM//McCann · Programmer · 28 days<br>Flight simulator (Angular, PhaserJS) with pseudo-3D mechanics built for canvas rendering. Sprites come from a recycled pool, then pan, rotate and scale for effects. |
| <img src="screenshots/older/wonderrocket.webp" alt="Wonder Rocket" width="250"> | **Wonder Rocket**<br>Nickelodeon · Designer, Animator, Programmer · 28 days<br>Upgrade-and-launch game. |
| <img src="screenshots/older/nog.webp" alt="Nog" width="250"> | **Nog**<br>CoolBuddy · Designer, Animator, Programmer · 14 days<br>Platformer with psychedelic themes. |
| <img src="screenshots/older/gumdrophop.webp" alt="Gum Drop Hop" width="250"> | **Gum Drop Hop**<br>MaxGames · Designer, Animator, Programmer · 21 days<br>Non-violent platformer. 360 million plays in 3 years; 2B+ plays across the franchise. |
| <img src="screenshots/older/theslob.webp" alt="The Slob" width="250"> | **The Slob**<br>PlayHub · Designer, Animator, Programmer · 21 days<br>Platformer adventure game. |
| <img src="screenshots/older/ballsoflife.webp" alt="The Balls of Life" width="250"> | **The Balls of Life**<br>MTV / Nickelodeon · Designer, Animator, Programmer · 21 days<br>Platformer comedy game. |
| <img src="screenshots/older/lostfluid.webp" alt="Lost Fluid" width="250"> | **Lost Fluid**<br>Nickelodeon · Designer, Animator, Programmer · 21 days<br>Experimental discovery platformer: land on a distant planet and start life on it. |
| <img src="screenshots/older/ironturtle.webp" alt="Iron Turtle" width="250"> | **Iron Turtle**<br>ArmorGames · Designer, Animator, Programmer · 21 days<br>Puzzle game featuring a robot, with springs, coins and puzzles. |
| <img src="screenshots/older/solarball.webp" alt="Solar Ball" width="250"> | **Solar Ball**<br>CoolBuddy · Designer, Animator, Programmer · 8 days<br>Physics puzzle game mixing pinball and pool. |
| <img src="screenshots/older/beanfiend.webp" alt="Bean Fiend" width="250"> | **Bean Fiend**<br>NextPlay · Designer, Animator, Programmer · 16 days<br>Platformer adventure game. |
| <img src="screenshots/older/redlander.webp" alt="Red Lander" width="250"> | **Red Lander**<br>Mathfort · Designer, Animator, Programmer · 3 days<br>Experimental education game. |
