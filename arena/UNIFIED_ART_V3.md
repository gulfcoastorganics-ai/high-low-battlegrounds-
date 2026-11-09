# Arena V3 — Unified Tactical Portraits & Compact Match HUD

This branch is a **visual overhaul of Arena Mode**, based on `arena-premium-character-v2`. It does not change `arena/engine.js` or original V8 Classic rules.

## Try it

**[Open V3 Arena in the browser](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-unified-art-v3/arena/index.html)**

Use the regular lobby, pick loadouts, enter local hotseat play, select a battlefield position and HIGHER or LOWER, optionally play a tactical character, then pass the device between players.

## What changed

- All **12 currently playable** tactical characters now use local `arena/art-premium/<id>.webp` artwork instead of alternating with flat vector illustrations in a single hand.
- Eight additional portrait replacements are optimized for mobile card size; the existing four premium portraits remain intact.
- Improved distinctness for **Kael Veridian**, **Vesper Kade**, **Solenne Prism**, **Thorne Wren**, and **Dagan Iron**, reducing face reuse in the interim art set.
- The remaining 12 **preview-only** character concepts stay locked/non-playable and display muted concept SVGs to make their unfinished status clear.
- New `arena/unified.css` applies a redesigned dealer back, brighter readable opponent cards, unified tactical card frames, and a compact desktop match layout with the odds and decision console beside the boards.
- The original standard playing cards remain untouched, including rank, suits and gameplay.

## Artwork provenance and quality limit

This is a **coherent illustrated prototype**, not 12 separately commissioned full-resolution AAA paintings. The four flagship images were generated as full-size original fantasy illustrations for this project. The eight new interim portraits were derived from original AI-generated concept scenes for this game, optimized and cropped into individual WebPs. Some of those derived images originate in small portions of a game concept mockup, so they may look softer than the flagships when opened full-screen.

For a final art release, replace these eight interim WebPs with **dedicated full-resolution illustrated character key art**, with one source image and stable design bible per character. Keep the current IDs and image paths to preserve compatibility.

## Display and performance

- Portraits are served as individual self-hosted WebP assets with no external runtime image dependency.
- `arena/unified.css` is a presentation-only layer loaded after `premium.css`.
- At desktop widths (1220px+), the decision console is positioned beside the 3-column battleground layout.
- Smaller layouts retain the stacked boards and accessible decision dock.
- Inactive battlefield buttons no longer inherit the global dim opacity, improving readability; burned/fatigued cards use purposeful visual treatment.
- The existing inspectable card details, two-player privacy handoff, and keyboard focus semantics remain.

## Verification

GitHub Actions runs `tests/premium_art_v3.test.cjs`, the existing original and Arena rules regressions, 100,000 exploratory bot matches, and Chromium checks at 320px / 390px / 768px / 1366px. The browser smoke test also fetches all 12 WebP files and checks the desktop side-by-side action dock.

**Not yet implemented:** authoritative online PvP, ranked play, progression, the 12 expansion abilities, bespoke character animations, sound design, and real Android hardware QA. These are separate production gates.
