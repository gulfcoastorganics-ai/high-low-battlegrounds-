# V4 Character Edition — High / Low: Battlegrounds

Branch: `arena-character-v4` (based on `arena-unified-art-v3`).

## Implemented
- Two **new dedicated high-resolution original character portraits** (510×680 WebP) for **Nyx Ardent / Dead Reckoning** and **Thorne Wren / Crosswind**. These replace their lower-detail V3 adapted artwork in `arena/art-premium/`.
- Preserved the original 10 other playable tactical card images, 12 abilities, gameplay logic, 52-card standard playing deck and original V8 Classic mode.
- New CSS-only `arena/v4.css` establishes a compact **desktop tactical workstation** for viewports 1300px and up: scoreboard + two battlefields + shared dealer and prediction controls at left, scrollable 2-column tactical card hand at right.
- Mobile and tablet remain stacked, touch-first. Rarity, faction colors, Focus price, accessible inspect controls and reduced-motion handling are retained.
- Expanded browser smoke tests to check real WebP content, V4 asset sizes, and the hand's position relative to the battlefield on laptop-size screens.
- Added V4 labeling while keeping the local-hotseat limitation visible.

## Visual audit status
This is an **incremental upgrade**. It is not accurate to say every character has a newly commissioned standalone portrait.

| Playable character | Art status |
|---|---|
| Astra Vale (Precision Strike) | Prior high-resolution dedicated portrait |
| Seraphine Rose (Heartward) | Prior high-resolution dedicated portrait |
| Cassian Gold (Golden Reserve) | Prior high-resolution dedicated portrait |
| Elder Rowan (Rooted Defense) | Prior high-resolution dedicated portrait |
| Nyx Ardent (Dead Reckoning) | **New dedicated portrait in V4** |
| Thorne Wren (Crosswind) | **New dedicated portrait in V4** |
| Orion Voss (Wide Angle) | Adapted V3 painted concept; dedicated upgrade outstanding |
| Ember Sol (Second Wind) | Adapted V3 painted concept; dedicated upgrade outstanding |
| Kael Veridian (Steady Hand) | Adapted V3 painted concept; dedicated upgrade outstanding |
| Vesper Kade (Calculated Exchange) | Adapted V3 painted concept; dedicated upgrade outstanding |
| Solenne Prism (Investment) | Adapted V3 painted concept; dedicated upgrade outstanding |
| Dagan Iron (Iron Grip) | Adapted V3 painted concept; dedicated upgrade outstanding |

The 12 additional expansion cards remain non-playable conceptual SVG entries; they are not part of PvP decks.

## QA gates

```sh
node --check arena/app.js
node --test tests/core.test.cjs tests/v8-tactical.test.cjs tests/arena.test.cjs tests/characters.test.cjs
python tests/arena_browser_check.py
node tests/arena_balance.cjs --games 100000
```

See the GitHub Actions `Arena Phase 1 QA` workflow for branch-specific run results.

## Current product limitations

- Hotseat, same device; **not** two-device online PvP or ranked multiplayer.
- Hidden future dealer sequence is still in local memory, so it is not anti-cheat secure for online play.
- No private accounts, public matchmaking, online timers, or authoritative server.
- Six remaining playable portraits are still adapted V3 assets; full art completion remains pending.
- No bespoke attack/power VFX or character animation beyond CSS interactions.
- The competitive engine must remain unchanged until balance work is explicitly scoped.

## Play

https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-character-v4/arena/index.html

This draft branch can be reviewed separately without merging into the V3 branch.
