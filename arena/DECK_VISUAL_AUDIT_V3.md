# Mystic Royale V3 — full 52-card visual audit and implementation

**Review the actual cards:** [52-card gallery](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-mystic-royale-v3-visual-audit/arena/deck-gallery.html) · **[Play Arena with V3](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-mystic-royale-v3-visual-audit/arena/index.html)**

## Source and audit method

Visual review is based on the user's 1366×768 Chromebook screenshot of **Mystic Royale V2 in the 4×4 Arena**, plus the actual V2 SVG generator and deployed deck assets. Source code audit covers all 52 face files and the shared dealer back. It does not assume a full-screen concept render is identical to the shipped assets.

At screenshot scale, the cards occupy roughly **68 × 95 pixels**. The two side-by-side boards and CPU prediction panel make compact legibility more important than intricate lines visible only at full zoom.

## Identified issues

| Finding | Player-facing impact | Priority | V3 treatment |
| --- | --- | --- | --- |
| Corner ranks too small against glossy details | Hard to tell 8 vs 9 vs 10 quickly | High | Larger ivory serif digits on dark, gold-trimmed rank plaques in opposite corners |
| 8/9/10 pips tightly stacked | Counts look like clusters of colored dots | High | Rebalanced rows, clearer spacing, exact suit counts |
| Court portraits inconsistently cropped and tiny | Kings, Queens and Jacks resemble photo fragments | High | Unified 158×190 illustrated portrait window, gold arch, readable KING/QUEEN/JACK labels |
| Faint pip colors against highly ornamented backgrounds | Suit identity takes longer to recognize | High | Sharper enamel jewels, reduced blur, separate suit palettes |
| Too many competing rings, stars and corner decorations | Decorative glitter overwhelms content | Medium | Simpler night-sky field, restrained filigree, quieter background geometry |
| Ace ornament competes with central suit symbol | Ace reads like another jeweled tile | Medium | Stronger central emblem, clean orbital ring, crown and small court subtitle |
| Gallery scale not representative of actual play | Design approves poorly performing thumbnails | Medium | 68px battlefield-scale gallery toggle and 16-card screenshot QA |

## New visual system

- **Spades:** illuminated sapphire, glacial highlights, royal indigo field
- **Hearts:** crimson-pink enamel against imperial violet
- **Diamonds:** copper / amber glow on deep purple
- **Clubs:** opalescent amethyst on midnight violet
- **Shared frame:** consistent high-contrast dual gold border, cleaner fantasy filigree and parchment-white rank indexes
- **All 2–10 cards:** exact number of visible suit pips; distinct compositions for each rank
- **12 royal cards:** consistent framed portraits using the project's existing original premium-character art; each embedded for offline rendering
- **4 Aces:** large jeweled suit seal and celestial halo
- **Dealer back:** original Mystic Royale violet-gold design retained for consistency

The playable tactical characters, environment HUD, scoring, CPU policy, dealer order, high/low probabilities and original V8 Classic deck have **not** been changed.

## Engineering implementation

`arena/tools/generate_mystic_deck.cjs` is the editable source for the complete set. Running it recreates `arena/cards-mystic/{S,H,D,C}-{2..10,J,Q,K,A}.svg` and the shared `back.svg` deterministically. The packaged SVGs use only self-contained vectors and embedded original portrait WebPs.

Changes to the card design remain source-controlled on an independent feature branch. They are intentionally not merged into the prior deck or original V8 branch without review.

## Quality gates

- Node checks for all 53 unique assets and correct ranks/suits
- Exactly N pips for cards 2 through 10 and pip-spacing checks
- Contrast-backed rank corner plaques and identical portrait windows
- Twelve unique embedded royal portraits; no external image links
- Reproducible generation and Git diff check
- Chromium loads 53/53 images and verifies playing-card use in real CPU Arena turns
- Gallery toggle at 68px actual battlefield width
- Large card preview and **actual-size 16-card screenshot** stored in GitHub Actions artifacts
- Original Arena, CPU, local two-player and Classic browser/rules regressions, plus existing 100,000-bot-match smoke test

## Remaining limitations

The twelve court portraits reuse existing approved Arena character illustrations rather than twelve brand-new, separately painted royal characters. The source portraits vary in their original composition; V3's unified window reduces but cannot entirely remove that difference. The style should be visually judged on real devices before claiming premium AAA readiness. Some visual filigree intentionally disappears at the 68px battlefield size, where rank and suit readability take priority.
