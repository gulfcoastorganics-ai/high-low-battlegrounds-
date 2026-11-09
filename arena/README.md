# HIGH / LOW: BATTLEGROUNDS — Arena Phase 1 + Original Character Overhaul

**Character art update:** The character-overhaul branch adds 24 original SVG portraits, character identities and lore, enlarged illustrated tactical cards, an inspectable collection and improved privacy handoff. Twelve abilities remain playable and twelve additional cards are clearly labeled previews. The original standard card deck and Classic Mode remain unchanged. See [the full source audit](CHARACTER_AUDIT.md).


This is a **playable local PvP vertical slice**, developed separately from the existing V8 AURUM ELITE game.

## Launch

Open `arena/index.html` from an HTTP static server, or use:

https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/ccg-pvp-battlegrounds/arena/index.html

The original game remains at `../index.html`. Its rules, art, and V8 tests are not overwritten.

For a local server, from the repo root:

```sh
python3 -m http.server 8000
# Visit http://localhost:8000/arena/
```

The mode does not require a backend, login, paid API, or external asset server (the decorative web font has a system fallback). Two players share a device and take turns privately.

## Rules and how to play

1. In the Deck Hall, choose two legal tactical decks (12 cards each; maximum two copies per card).
2. Enter Arena. Both sides begin with **identical** arrangements of 16 standard cards from a shuffled 52-card dealer deck, but each side maintains its own board.
3. On each of the 18 synchronized turns, select one of the three offered positions, optionally activate one tactical card, and lock HIGHER or LOWER.
4. Pass the device to the second player behind the privacy screen. No dealer card is revealed until both decisions are locked.
5. The next standard dealer card is shown to both. Correct predictions replace the selected standard card; incorrect predictions or ties burn the position permanently, unless an explicit protective ability applies.
6. After two successes on one position, it rests for the next two turns. Opponent restrictions and fatigue may alter target offers; no restriction is allowed to remove every legal target.
7. At the end, more surviving positions wins. First tiebreaker: more correct predictions. A tie after regulation leads to one three-turn fresh-deck sudden-death contest with no tactical abilities; another tie is declared a draw.

**Aces are high; equal ranks always fail the underlying prediction.** Protection does not turn a tie into a correct prediction. Both players see public, unrevealed-card-safe odds computed from the original board and *previously* dealt dealer cards.

## Focus and tactical decks

Each player begins with 2 Focus, receives +1 at the start of each turn, and can bank at most 5. Ability costs are 1–4 Focus. One tactical card may be played per turn. The initial tactical hand contains 3 cards; each turn draws one more if below the hand limit of 5, including the first turn. Discarded tactical cards are not reshuffled.

Tactical abilities are separate from ordinary playing cards.

| Faction | Fully playable cards |
| --- | --- |
| Spades | Precision Strike, Wide Angle, Dead Reckoning |
| Hearts | Heartward, Second Wind, Steady Hand |
| Diamonds | Golden Reserve, Calculated Exchange, Investment |
| Clubs | Crosswind, Iron Grip, Rooted Defense |

The Collection Vault also shows **12 labeled future concept cards** in the expansion gallery. They are preview-only: not yet part of gameplay, decks, or collectible progression.

Three valid starter decks are included: Balanced, Guardian, and Tactician. A visual deck builder supports adding and removing cards, enforcing copy limits and saving each player's deck to localStorage where available.

## Resolution order

1. Before the turn, apply +1 Focus and draw a tactical card if below hand cap.
2. Both decisions commit privately, with card and target validation. No board mutation or dealer reveal occurs until both are locked.
3. After lock, pay tactical card costs simultaneously in independent player states; resolve **pre-reveal effects** (fatigue reset, Focus reserve, and future-turn disruptions).
4. Reveal exactly one common dealer card from the shuffled sequence.
5. For each board independently, compare the guess using strict rank. Resolve protection, card replacement or burn, fatigue, and on-success effects. Apply optional hand cycling.
6. Record the event and score, then either end the match, enter sudden death, or advance and prepare the next turn.

No ability rewrites the shuffled standard dealer sequence.

## Verification

Automated tests:
```sh
node --check arena/engine.js
node --check arena/app.js
node --test tests/core.test.cjs tests/v8-tactical.test.cjs tests/arena.test.cjs
python tests/arena_browser_check.py  # requires Playwright and Chromium
node tests/arena_balance.cjs --games 100000
```

The optional simulation harness supports at least 100,000 complete local games, logs win/draw rates, turns, ability use, and aggregate hits/burns. It uses exploratory bots; it is **not** enough to declare faction or human-skill balance.

GitHub Actions workflow: `.github/workflows/arena-qa.yml`.

## Known Phase 1 limitations

- **Local hotseat only.** There is no trusted multiplayer server, ranked queue, account identity, anti-cheat, 20-second authoritative match clock, secure dealer commitment, or reconnect support. Local state and hidden deck order are inspectable in dev tools, so this build **must not** be marketed as secure online PvP.
- No progression, unlock economy, packs, match history persistence, achievements, Android packaging verification, or server-side match validation.
- The 12 tactical cards have premium symbolic suit treatments, not fully illustrated character artwork or finished bespoke foil animations.
- A preview catalog of 12 additional concepts is non-playable.
- No time limits in local hotseat, to allow passing one device between players.
- Sudden death is one three-turn stage followed by a declared draw if still tied.
- Balancing, high-end animation/audio polish, accessibility, real-device touchscreen testing, and network security require further work.

## Roadmap

**Phase 2:** implement the 12 preview cards with exact resolution, art, card inspection, meaningful collection/progression, richer deck editing, saved match history, and validate with simulations.

**Phase 3:** bespoke illustrated frames, premium physical card movement and dealer animations, FFX/VFX and audio, haptics where supported, reduced-motion and quality options.

**Phase 4:** implement server-authoritative matches via an authenticated backend; secure shuffle, hidden information, validation, atomic resolution, reconnect, custom duel rooms, two-device testing.

**Phase 5:** ranked play, matchmaking, replay and analytics, draft mode, balanced availability and tournament readiness.

**Phase 6:** Android wrapper, performance/security/a11y release gates, production deployment and polish.

## Philosophy

Build an original prediction-and-territory battler, not a clone of a licensed CCG. Cosmetic rarity must not grant numerical advantages; every gameplay-relevant card needs a deterministic free path to unlock when account progression arrives. No cash betting or redeemable rewards.
