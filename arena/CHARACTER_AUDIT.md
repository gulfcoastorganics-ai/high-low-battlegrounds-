# HIGH / LOW: BATTLEGROUNDS — Complete Source Audit & Character Overhaul

**Audit scope:** `index.html` (V8 Classic/Tactical), `arena/` local collectible PvP, deck/character registries, 52 SVG standard cards, Android WebView packaging, GitHub Actions rules and browser tests, and online architecture documents.

**Audited branches:** `v8-aurum-elite` → `ccg-pvp-battlegrounds` → `arena-character-overhaul`.

**Implementation status:** Character presentation and packaging work are implemented in `arena-character-overhaul`. This is an offline, local vertical slice, **not a production-ready online multiplayer release**. No invented percentage or AAA readiness score is assigned.

## Executive assessment

| Area | Finding | Severity | Status |
|---|---|---|---|
| Original high/low rules | Aces high, ties lose, successful rank replacement, wrong prediction burns; isolated from Arena | Low | Preserved, regression tested |
| Solo Classic/Tactical | 3×3/4×4, blind/face-up, audio, save/replay and virtual credits | Low | Existing features preserved |
| Local Arena PvP | Separate 4×4 boards, shared unknown dealer, 18 turns, legal target offers, fatigue, one ability/turn | Low | Implemented and tested |
| Tactical rules engine | 12 enabled abilities, deterministic resolution, Focus cost/limits, sudden death | Medium | Stable in tests; needs balance playtesting |
| Characters and collectible value | Previous tactical cards were symbol-only and did not communicate character identity | High | **24 original SVG portraits and lore; card inspector and gallery added** |
| Collection clarity | 12 conceptual expansion cards looked similar to enabled abilities | Medium | Labeled portraits as non-playable previews |
| Hotseat information concealment | Underlying UI rendered next player's hand beneath the pass overlay | Medium | Neutral sealed view now replaces it |
| Android packaging | Debug APK workflow previously copied `index.html` without `assets/cards`; visual assets could be missing | High | Workflow copies `assets/` and `arena/` with existence guards |
| Discoverability | Classic lacked a direct entry to the new Arena | Medium | Added Arena navigation to original V8 entry screen |
| Browser responsiveness | 390px and 1366px checks passed; narrower and real touch device validation missing | Medium | Smoke-tested; physical hardware still needed |
| Online PvP fairness | Entire dealer order resides client-side; no trusted backend, authenticated moves or real-time synchronization | **Release blocker** | Not implemented; ranked must remain disabled |
| Progression / persistence | Arena saves loadouts only; live matches and progression do not survive reload | Medium | Not implemented |
| Animation / audio | Stylish CSS treatment and card reveal, but no bespoke soundscape, physical-character animation, or production-grade VFX | Medium | Planned |
| Accessibility | Basic button semantics and reduced-motion CSS exist; DOM replacement may interrupt keyboard focus/screen readers | Medium | Needs dedicated accessibility QA |
| Maintainability | V8 remains a large standalone HTML file; Arena is separated by engine/UI/art but ability effects live in engine conditionals | Medium | Gradual refactor recommended |
| Localization and offline fonts | Online Google Fonts may fail without internet; system fallback works | Low | Acceptable for prototype |
| Competitive monetization | No cash betting or redeemable rewards, but future commerce must remain cosmetic/fair | Low | Preserve this rule |

## Original character roster implemented

24 distinct original SVG assets are now stored under `arena/art/*.svg`. The character registry in `arena/characters.js` holds names, titles, faction alignment and flavor lore. Character identity does **not** change the authoritative tactical ability.

| Faction | Enabled characters | Future character concepts |
|---|---|---|
| Spades | Astra Vale (Precision Strike), Orion Voss (Wide Angle), Nyx Ardent (Dead Reckoning) | Iris North, Silas Quill, Eira Frost |
| Hearts | Seraphine Rose (Heartward), Ember Sol (Second Wind), Kael Veridian (Steady Hand) | Liora Pyre, Elowen Thread, Tavian Hearth |
| Diamonds | Cassian Gold (Golden Reserve), Vesper Kade (Calculated Exchange), Solenne Prism (Investment) | Auric Flint, Lady Marcelle, Riven Lux |
| Clubs | Thorne Wren (Crosswind), Dagan Iron (Iron Grip), Elder Rowan (Rooted Defense) | Morrigan Thorn, Fenn Bramble, Vera Nightroot |

Each character has a visibly distinct original illustration with variations in face, hair, costume, headgear, pose accessories, symbolic equipment, faction palette and lore. Assets are standalone, first-party SVGs with no external embedded images. They are original illustrated vector art, **not** finished high-fidelity 3D models or premium painted illustration commissions.

### UI implementation

- New 4-character **featured showcase** on the opening Arena screen.
- Enlarged character-illustrated tactical cards with faction frames, cost and action display.
- Dedicated **Inspect** action for each card, available even when that card is too expensive to play.
- Portrait, character identity, title, flavor lore, rules text, Focus cost, faction and rarity in the inspector.
- Updated collection editor with individual artwork and inspect controls for all 24; 12 preview identities remain clearly disabled from deck construction.
- Sealed neutral screen for player-to-player hotseat privacy.
- Preserved traditional 52-card battlefield visuals and original V8 Classic rules.

## Rules audit details

The new Arena uses a single 52-card dealer shuffled with cryptographic random bytes when supported; 16 initial standard-card placements are copied to independent local boards. Both sides are compared against the same dealer draw each turn, and the deck is not modified by tactical abilities. Strict comparisons make equal rank a failed prediction even if a defensive ability preserves the territory.

All turn effects resolve after both players lock decisions. The first locked decision does not resolve early. The target offer chooses three eligible positions, with exceptions for explicit ability effects and all-fatigue fallback. Two successes on one slot apply two following turns of rest. Focus is capped at five. The hand is capped at five, tactical decks at 12 cards, and tactical cards are not reshuffled.

**Design watch-outs:** The local client contains the future shuffle and both private decks in memory, so it is not secure online PvP. Most abilities are data-registry entries but their effects remain hardcoded into the engine. Sudden death resets board and hit counts and is one three-turn stage before a possible draw. These behaviors are documented and tested, but product design should affirm them before ranked play.

## QA / confidence

GitHub Actions on `arena-character-overhaul` runs:
- Original V8 embedded rule tests plus new Arena logic and character-asset validation.
- Responsive Chromium user flows at 390px and 1366px: lobby, featured portrait inspection, collection browser, character inspector, local two-player commitments, concealed handoff, reveal and next turn.
- 100,000 complete exploratory bot matches using balanced starter decks; tracks outcomes, draws, ability use and simulation errors.
- Separate Android Gradle APK packaging workflow with full asset-copy guards.

**Important:** Bot simulations provide regression and first-seat bias indicators, not human skill balance. A single device cannot verify secure online play or multiplayer latency. Physical Android/WebView tests remain outstanding.

## Recommended next engineering priorities

1. **P0 — Online PvP backend:** authenticated player seats, server-owned shuffled dealer and tactical decks, private visible state, timed actions, deterministic atomic resolution, idempotency, reconnect, trusted replay and action audit, fair matchmaking.
2. **P1 — Interaction polish:** physical dealer draws, unique ability activation VFX, full portrait animations, sound and card hover/touch polish; preserve reduced-motion and latency-friendly fast mode.
3. **P1 — Live save and progression:** local match resume, non-cash crafting, achievement tracking, cosmetic unlocks, secure online progression later.
4. **P1 — Human balance:** run representative deck matchup matrices, Focus pressure simulations and live playtests; tune abilities by win rates and decision quality rather than rarity.
5. **P2 — Accessibility and mobile:** focus preservation across rerenders, keyboard screen-reader audit, real touchscreen tests, layout at 320px, Android install/resume/back behavior, offline font/assets.
6. **P2 — Scalable content authoring:** migrate effects to a formal event/priority processor, add a content schema validator, release the 12 concept cards only when their effects and counterplay are actually implemented.

## Reproduction and launch

Play the character-overhaul branch:
https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-character-overhaul/arena/index.html

To run locally from a checkout:

```sh
python3 -m http.server 8000
# open http://localhost:8000/arena/
```

Audit and regression commands:

```sh
node --check arena/engine.js
node --check arena/app.js
node --check arena/characters.js
node --test tests/core.test.cjs tests/v8-tactical.test.cjs tests/arena.test.cjs tests/characters.test.cjs
python tests/arena_browser_check.py
node tests/arena_balance.cjs --games 100000
```

**Merge gate:** Review the new illustrations and their names, verify latest GitHub Actions and Android artifact packaging, then merge the character overhaul into the collectible PvP development branch only after acceptance. Do not overwrite the original V8 Classic branch or merge untested online code.
