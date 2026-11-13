# Mystic Royale V4 — 52-card audit, clarity pass, and in-game inspection

**Playable V4:** https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-mystic-royale-v4-clarity/arena/index.html

**Actual 52-card gallery:** https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-mystic-royale-v4-clarity/arena/deck-gallery.html

## Grounded source audit

Reviewed the shipped V3 deck generator, all 52 actual SVG face assets, matching dealer back, the V3 battlefield-scale Chromium screenshot (68 × 95px cards), and the Arena match UI. The existing cards have good illustrated royal portraits and a striking violet/blue palette, but visual hierarchy still suffers at real size.

| Severity | Observed V3 problem | V4 improvement |
|---|---|---|
| High | Bottom-right mirrored rank is upside-down and illegible at 68px, competing with the center art | Replace with a small, gold-ringed, color-matched suit sigil; keep the large top-left rank readable |
| High | Gold crown overlay intersects some court artwork (especially illustrated Queens) | Reposition the crown to the upper arch, reduced to 63%; the portrait remains unobscured |
| Medium | Closely packed higher-rank pips merge into fuzzy clusters, especially Clubs | Reduce pip halo and Gaussian blur opacity, strengthen metallic edges and central highlights |
| Medium | Clubs tend to wash out toward silvery-white, too similar to Spade highlights | Shift Clubs toward a richer amethyst interior and simplify their three-lobed emblem outline |
| Medium | Card images on the 4×4 grid cannot be examined without leaving gameplay | Add a magnifier on the **selected human territory**, with a full-size actual playing-card SVG and accessible close action; the choice, prediction, and CPU fairness remain unchanged |
| Low | Card version metadata on the shared dealer back is vulnerable to manual skew | Generate metadata for **all 53 assets** from one deterministic source and cover them with validation |

## What changed

- `arena/tools/generate_mystic_deck.cjs` generates all 52 face SVGs + shared dealer back.
- `arena/cards-mystic/` now has the regenerated V4 assets, with unchanged file paths and suit/rank identifiers.
- `arena/app.js` adds the optional selected-card inspector. It reads only the user's own selected, living territory after that position was chosen.
- `arena/mystic-deck.css` styles the inspector and compact magnifier without changing the card layout or collectible character cards.
- `tests/mystic_deck.test.cjs` checks suit pip counts, uniqueness, one rank plaque and one corner sigil, consistent royal image window and floating crown.
- `tests/mystic_deck_browser.py` tests the real browser flow: choose territory, enlarge actual image, close via Escape, retain selected position, predict and resolve the CPU turn.

## Visual design scope

This is a real SVG asset update, not a generated full-screen concept illustration. It keeps the ornate midnight violet, royal blue and gold aesthetic; the 12 court portraits are the existing first-party fantasy character paintings rather than new bespoke portrait commissions.

The **original Classic Mode** still uses its own standard card images, and the Arena character/tactical artwork stays intact.

## Acceptance and limits

Tests must pass for every SVG, correct 2–10 pip counts, portrait embeddings, deterministic asset generation, image decoding and dealer reveal, and CPU/Classic/hotseat rules. Browser visual previews capture 8 cards at gallery size and 16 cards at actual 68px battlefield size.

We can verify browser functionality and visual geometry with Chromium, but real hardware use and qualitative accessibility across eyesight conditions need human testing. There is no claim of exact fidelity to the earlier AI concept art, a production-grade illustrator pass, or secure online ranked PvP.
