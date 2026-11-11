## NEW: ARENA COMBAT WORKSTATION V5

The Arena match interface now integrates the **4×4 battlefield**, **prediction controls**, and **compact tactical-character rail** on one desktop screen. Selected abilities display their portrait, Focus cost, target, and turn guidance. On mobile, use **BOARD / PREDICT / HAND** quick navigation. CPU and hotseat gameplay are preserved.

**[Play Combat V5](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-combat-workstation-v5/arena/index.html)** · [Read the V5 UI/UX audit](arena/COMBAT_WORKSTATION_V5.md)

---

## ⚔ NEW: PLAY VS CPU — SOLO ARENA

The Arena now has **Play vs CPU** (Casual / Standard / Expert) and retains **Local 2-Player** hotseat. Pick your rival's deck, then lock a HIGHER or LOWER prediction; the CPU takes its legal turn immediately and the shared dealer reveals both results. No login or network is required.

**[Play vs CPU in Arena](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-play-vs-cpu/arena/index.html)** · [Solo-mode rules and fairness](arena/CPU_MODE.md)

---

# HIGH / LOW: BATTLEGROUND V8 — AURUM ELITE

## Premium Arena Characters — V2 Art & UI

**[Play the premium portrait build](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-premium-character-v2/arena/index.html)**

Four original high-detail painted characters (Astra Vale, Seraphine Rose, Cassian Gold and Elder Rowan) now ship as local WebP assets, with a more compact, cinematic lobby, refined illustrated card UI, and matching collection/character inspection. The other 20 character portraits still use the original vector artwork. The original V8 rules are untouched. [Artwork scope and verification](arena/PREMIUM_ART_PASS.md).

---


## ✦ NEW: ORIGINAL CARD CHARACTERS — ARENA OVERHAUL

**[Play the updated character Arena](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-character-overhaul/arena/index.html)** · **[Read the full game audit](arena/CHARACTER_AUDIT.md)**

The standalone `arena/` expansion now has 24 original illustrated SVG character portraits, named faction champions, lore, enlarged playable cards, card inspection, and a visually upgraded collection. **12 abilities are playable; 12 character concepts are still previews.** The original V8 game remains available and has a navigation link to Arena.

The Android debug workflow now bundles standard playing-card assets as well as Arena assets. Local gameplay and browser checks are covered in automated tests. This is **not online-ranked production PvP**.

---


A polished, responsive HTML5 playing-card survival game with classic card art, cinematic dealer draws, and optional Tactical rules.

## Play in browser

Open the **game page**, not the GitHub source-file viewer:
https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/v8-aurum-elite/index.html

On first use, the temporary HTML hosting service may show an external-content confirmation. Press **Open the page** to continue. For permanent public hosting, configure GitHub Pages or deploy these files as a static directory.

## Two distinct rulesets

**Classic:** The original game is unchanged. Every live position is selectable; correctly predicted dealer cards replace the board card, while wrong predictions or ties permanently burn the space.

**Tactical Survival:** Exactly three *marked targets* are offered at the start of each turn, unless fewer eligible live positions remain. After two successful uses of a board position, that space rests for two following turns. Offers rotate predictably based on the public turn count and live/available positions, never future hidden cards. If every surviving position is resting, the earliest recovering position becomes temporarily eligible so a run cannot deadlock.

All existing modes remain: 3×3 and 4×4, face-up and blind, solo and local same-deck PvP. Competitive score remains the number of dealer draws survived, with ties going to sudden death.

## Mastery rating

The additional post-round mastery measure (0–100) uses:
- 50% dealer-deck progress
- 30% live board positions remaining
- 20% prediction accuracy

Bronze <60; Silver 60–74; Gold 75–84; Platinum 85–91; Diamond >=92. This rating does **not** change the original game's win condition, competitive score, or virtual payout formula.

## UI/UX
- Premium **CC0** SVG cards in `assets/cards` with traditional illustrated courts and full number-card pip arrangements.
- Dealer shoe and in-motion 3D card flights; tap a flying card to skip the reveal.
- Sound from synthesized card-slide, impact, burn, and victory cues. Sound can be toggled.
- Strategically limited targets visibly glow in Tactical; other cards are visibly unavailable.
- Mobile selection/odds/decision controls remain directly under the board.
- Reduced-motion preference is respected; all game state is committed before animation.

## Tests

Run `node --test tests/v8-tactical.test.cjs`. A branch-only workflow `.github/workflows/v8-rules.yml` also runs those checks on push. Chromium browser checks covered 360px, 390px and desktop layouts; remote browser playtests verified live premium SVG artwork, 4×4 Tactical/Classic selection and one complete dealer draw.

## Limitations

Online multiplayer is **not active** and requires a server-authoritative backend. Virtual credits are for practice only and have no cash value. The native Android wrapper and its artifact have not been verified with this V8 source. The temporary raw.githack hosting link is not equivalent to a permanent deployment.

V8 uses the existing V7 premium deck base, preserving all original rules in Classic.


---

## NEW: BATTLEGROUNDS — THE ARENA (Phase 1)

**Play local two-player collectible Arena:** [Open Arena in your browser](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/ccg-pvp-battlegrounds/arena/index.html)

Arena lives in `arena/` on the independent `ccg-pvp-battlegrounds` branch. The original V8 `index.html` and Classic gameplay remain untouched.

Phase 1 includes synchronized shared dealer draws, two independent 4×4 boards, 12 playable tactical cards, 12 upcoming collection concepts, the tactical deck forge, Focus, fatigue, legal target offers, local hotseat privacy handoff, win resolution, and sudden death.

See [Arena Phase 1 technical notes](arena/README.md) for the full rules, limitations, testing instructions, and production roadmap. **Online matchmaking, real network secrecy, ranked play, and an authoritative backend are not implemented yet.**
