# Premium Character V2 — Illustrated Arena Art Pass

## Status

**Playable UI upgrade**, built as an independent branch on top of `arena-character-overhaul` and preserving the original V8 Classic/Tactical and Arena game rules. The Arena remains **local hotseat PvP**, not server-authoritative online or ranked play.

Live preview:
https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-premium-character-v2/arena/index.html

## Delivered

- Reorganized the Arena lobby so the entry action and character art appear much earlier; reduced excessive heading and panel whitespace.
- Created and committed four high-detail original fantasy character illustrations to `arena/art-premium/`:
  - **Astra Vale** — `precision.webp` — Spades, Precision Strike
  - **Seraphine Rose** — `heartward.webp` — Hearts, Heartward
  - **Cassian Gold** — `reserve.webp` — Diamonds, Golden Reserve
  - **Elder Rowan** — `rooted.webp` — Clubs, Rooted Defense
- All four WebP assets are **first-party repository files**; no remote image CDN, user account, or API key required.
- Added `arena/premium.css` as an isolated premium art direction layer: emerald/gold surfaces, sophisticated character frames, quality gradients, hover and selection polish, mobile spacing, reduced-motion support.
- Connected premium portraits to the opening character gallery, tactical hand, deck-builder collection entries, and full character inspection view. The original SVG portraits remain as fallbacks for other characters.
- Original playing-card art, card code, strict-rank comparison, shared-dealer fairness, fatigue, and Focus ability logic are unchanged.
- Added regression checks verifying the premium WebP files are valid, load correctly in Chromium at 320px/390px/768px/1366px, and preserve V8 Classic functionality.
- Updated Android packaging rules to require premium assets and styles.

## Remaining artwork

The other **20 characters currently retain their original SVG illustrations**. They were not silently renamed or replaced by stock art. All 24 still have unique identity, names, and lore. Twelve tactical abilities are playable, while twelve expansion concepts remain non-playable previews.

To promote any future character to premium artwork:
1. Design an original 2:3 portrait with the appropriate faction palette, distinctive face/silhouette, gear, and environment.
2. Export as optimized 400×600 or higher WebP into `arena/art-premium/{id}.webp`.
3. Add that `id` to `PREMIUM_IDS` in `arena/app.js`.
4. Add image existence/decoding assertions in browser and character tests.
5. Confirm readability on mobile tactical hand and full-screen inspect view.

## Release gates

- Gameplay logic tests and 100,000 complete exploratory bot-match simulation pass.
- Chromium Arena user flows and original Classic V8 regression flows pass.
- Android debug APK packaging workflow should pass with the four premium assets included.
- Aesthetic review and physical Android touch/performance are still required.
- Ranked/matchmaking production deployment requires an authoritative backend; the local game remains inspectable and is not secure real-time PvP.

Do not claim the artwork is AAA-production complete while 20 portraits remain vector illustrations or imply that the backend is deployed.
