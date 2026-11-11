# MYSTIC ROYALE — Arena's standard playing cards

**View all 52 card faces:** [Mystic Royale Gallery](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-mystic-royal-deck/arena/deck-gallery.html)

**Play Arena with the deck:** [Arena Combat Workstation](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-mystic-royal-deck/arena/index.html)

This change redesigns **only the traditional 52 playing-card faces and dealer card back**. It does not recolor the overall game interface, replace illustrated tactical character cards, or change gameplay.

## Look and feel

- **Card surfaces:** deep royal indigo, midnight violet and starlit purple gradients.
- **Borders:** gold filigree and double ornamental edge lines.
- **Suit colors:** sapphire blue spades, magenta-violet hearts, gilded-amber diamonds, and periwinkle clubs.
- **Numerals (2–10):** exactly the corresponding number of luminous raised suit pips; legible rank/suit indexes on opposite corners.
- **Royal cards (J/Q/K):** individually composed arcane-court portraits within metallic medallions, with recognizable rank labels.
- **Aces:** oversized mystic suit seal, crown, constellation rings and unique suit-associated subtitle.
- **Dealer back:** symmetrical violet-gold royal insignia with astral compass geometry and a jeweled crown.

All art is first-party SVG, with no external image dependencies. Both players' boards and revealed dealer cards use the new artwork. The CPU, offline hotseat and sudden death modes all share the same new visual deck.

## Implementation

- `arena/cards-mystic/S-2.svg` through `C-A.svg` — exactly 52 playing-card face images
- `arena/cards-mystic/back.svg` — one shared dealer card back
- `arena/app.js` — only the `image(id)` URL mapping was changed; rank mapping is unchanged
- `arena/mystic-deck.css` — the dealer back and subtle battlefield face-card polish
- `arena/tools/generate_mystic_deck.cjs` — deterministic source generator for all SVG files
- `arena/deck-gallery.html` — responsive, suit-filterable, distraction-free asset viewer

**Important distinction:** the legacy Classic Mode continues to use its original `assets/cards/` images. We intentionally did **not** overwrite those files.

## QA

```sh
node --test tests/mystic_deck.test.cjs
node arena/tools/generate_mystic_deck.cjs
git diff --exit-code -- arena/cards-mystic/
python tests/mystic_deck_browser.py
```

CI validates that the complete 53-image set renders, that each pip card shows its correct count, that every suit/rank is correctly labeled, that both Arena boards and dealer reveals reference Mystic Royale assets, that the CPU resolves a turn correctly, and that legacy Classic, CPU and hotseat regressions still pass.

The deck is intentionally a **visual-only** upgrade. Rank, suit, higher/lower probabilities, Focus, fatigue, scores, and CPU strategy are untouched.
