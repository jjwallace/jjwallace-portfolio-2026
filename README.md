# Jesse Wallace: Portfolio 2026

Interactive web work: games, canvas rendering, physics, and AI-native tools.
15+ years shipping real-time interactive software · 41+ published web games · 2B+ plays

[GitHub](https://github.com/jjwallace) · [LinkedIn](https://linkedin.com/in/jjwallace)

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

## Older Projects

Commercial web games from 2008 to 2016, published by Nickelodeon, MTV, ArmorGames, MaxGames and others. Originally shown on [my earlier portfolio site](https://jjwallace.github.io/jjwallace-website/).

<table>
<tr>
<td width="50%" valign="top"><a href="https://www.kongregate.com/en/games/jjwallace/gum-drop-hop"><img src="screenshots/older/gumdrophop.webp" alt="Gum Drop Hop" width="100%"></a><br><a href="https://www.kongregate.com/en/games/jjwallace/gum-drop-hop"><b>Gum Drop Hop</b></a><br><sub>MaxGames · Designer, Animator, Programmer · 21 days</sub><br>Non-violent platformer. 360 million plays in 3 years; 2B+ plays across the franchise.<br><a href="https://www.kongregate.com/en/games/jjwallace/gum-drop-hop">Play</a></td>
<td width="50%" valign="top"><a href="https://www.kongregate.com/en/games/jjwallace/wonder-rocket"><img src="screenshots/older/wonderrocket.webp" alt="Wonder Rocket" width="100%"></a><br><a href="https://www.kongregate.com/en/games/jjwallace/wonder-rocket"><b>Wonder Rocket</b></a><br><sub>Nickelodeon · Designer, Animator, Programmer · 28 days</sub><br>Upgrade-and-launch game.<br><a href="https://www.kongregate.com/en/games/jjwallace/wonder-rocket">Play</a></td>
</tr>
<tr>
<td width="50%" valign="top"><a href="https://armorgames.com/play/4568/iron-turtle"><img src="screenshots/older/ironturtle.webp" alt="Iron Turtle" width="100%"></a><br><a href="https://armorgames.com/play/4568/iron-turtle"><b>Iron Turtle</b></a><br><sub>ArmorGames · Designer, Animator, Programmer · 21 days</sub><br>Puzzle platformer featuring a robot turtle, with springs, coins and puzzles.<br><a href="https://armorgames.com/play/4568/iron-turtle">Play</a></td>
<td width="50%" valign="top"><a href="https://www.addictinggames.com/funny/balls-of-life"><img src="screenshots/older/ballsoflife.webp" alt="The Balls of Life" width="100%"></a><br><a href="https://www.addictinggames.com/funny/balls-of-life"><b>The Balls of Life</b></a><br><sub>MTV / Nickelodeon · Designer, Animator, Programmer · 21 days</sub><br>Platformer comedy game.<br><a href="https://www.addictinggames.com/funny/balls-of-life">Play</a></td>
</tr>
<tr>
<td width="50%" valign="top"><a href="https://www.kongregate.com/en/games/jjwallace/lost-fluid"><img src="screenshots/older/lostfluid.webp" alt="Lost Fluid" width="100%"></a><br><a href="https://www.kongregate.com/en/games/jjwallace/lost-fluid"><b>Lost Fluid</b></a><br><sub>Nickelodeon · Designer, Animator, Programmer · 21 days</sub><br>Experimental discovery platformer: land on a distant planet and start life on it.<br><a href="https://www.kongregate.com/en/games/jjwallace/lost-fluid">Play</a></td>
<td width="50%" valign="top"><a href="https://www.kongregate.com/en/games/jjwallace/solar-ball"><img src="screenshots/older/solarball.webp" alt="Solar Ball" width="100%"></a><br><a href="https://www.kongregate.com/en/games/jjwallace/solar-ball"><b>Solar Ball</b></a><br><sub>CoolBuddy · Designer, Animator, Programmer · 8 days</sub><br>Physics puzzle game mixing pinball and pool.<br><a href="https://www.kongregate.com/en/games/jjwallace/solar-ball">Play</a></td>
</tr>
<tr>
<td width="50%" valign="top"><a href="https://www.kongregate.com/en/games/jjwallace/bean-fiend"><img src="screenshots/older/beanfiend.webp" alt="Bean Fiend" width="100%"></a><br><a href="https://www.kongregate.com/en/games/jjwallace/bean-fiend"><b>Bean Fiend</b></a><br><sub>NextPlay · Designer, Animator, Programmer · 16 days</sub><br>Platformer adventure game.<br><a href="https://www.kongregate.com/en/games/jjwallace/bean-fiend">Play</a></td>
<td width="50%" valign="top"><img src="screenshots/older/nog.webp" alt="Nog" width="100%"><br><b>Nog</b><br><sub>CoolBuddy · Designer, Animator, Programmer · 14 days</sub><br>Platformer with psychedelic themes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="screenshots/older/theslob.webp" alt="The Slob" width="100%"><br><b>The Slob</b><br><sub>PlayHub · Designer, Animator, Programmer · 21 days</sub><br>Platformer adventure game.</td>
<td width="50%" valign="top"><img src="screenshots/older/redlander.webp" alt="Red Lander" width="100%"><br><b>Red Lander</b><br><sub>Mathfort · Designer, Animator, Programmer · 3 days</sub><br>Experimental education game.</td>
</tr>
</table>

---

## Corporate

Games built for brands and partners.

<table>
<tr>
<td width="50%" valign="top"><a href="https://wolfgames.net"><img src="screenshots/corporate/clue-hunter.webp" alt="Law &amp; Order: Clue Hunter" width="100%"></a><br><a href="https://wolfgames.net"><b>Law &amp; Order: Clue Hunter</b></a><br><sub>Wolf Games · on Peacock</sub><br>Puts Peacock viewers in the detective's seat: inspect crime scenes, identify suspects and close cases without leaving the app.<br><a href="https://wolfgames.net">Wolf Games</a></td>
<td width="50%" valign="top"><img src="screenshots/corporate/bioextract.webp" alt="Bio Extract" width="100%"><br><b>Bio Extract</b><br><sub>US Army / FOX @ MRM//McCann · Programmer · 21 days</sub><br>Tap/click strategy game (Angular, PhaserJS): isolate mind-controlling alien microbes. Used for microbiologist recruiting.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="screenshots/corporate/uav.webp" alt="UAV" width="100%"><br><b>UAV</b><br><sub>US Army / FOX @ MRM//McCann · Programmer · 28 days</sub><br>Flight simulator (Angular, PhaserJS) with pseudo-3D mechanics built for canvas rendering. Sprites come from a recycled pool, then pan, rotate and scale for effects.</td>
<td width="50%"></td>
</tr>
</table>
