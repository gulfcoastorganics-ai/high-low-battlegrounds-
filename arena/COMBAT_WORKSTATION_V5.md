# Arena Combat Workstation V5 — UI/UX overhaul

**Playable V5:** https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-combat-workstation-v5/arena/index.html

This is an additive, responsive interface upgrade on top of `arena-play-vs-cpu`. The original V8 Classic experience, PvP hotseat flow, 52-card dealer, 12 tactical abilities, CPU decision policy, legal actions and scoring are unchanged.

## Problems observed in V4 screenshots

- The illustrated tactical cards appeared a screenful below the 4×4 battleground at desktop resolutions.
- Selecting a character such as Elder Rowan showed the effect in the hand but no obvious next action near the prediction buttons.
- The probability panel and prediction buttons were not visually integrated with the active tactical character.
- Moving between target selection and card selection involved repeated scrolling.

## Implemented

- **Desktop combat workstation (width >= 1120px):** battlefield + shared dealer, probabilities/decisions, and a separate compact tactical-card rail occupy one horizontal workspace. Five character rows stay in view on typical laptop/desktop sizes.
- **Selected-character panel:** when a tactical card is armed, display the portrait, character name, ability, actual Focus cost (including current turn taxes), selected friendly territory and relevant enemy target, and a cancel control. Without a card, show the free standard prediction state.
- **Guided sequence:** contextual TARGET / PREDICT / LOCK steps update as the player makes a valid decision, including a special hint when Crosswind requires an enemy target.
- **Mobile/tablet navigation:** a compact sticky BOARD / PREDICT / HAND bar enables direct jumps between long-page sections, with reduced-motion-aware scrolling. Existing touch-friendly illustrated cards are preserved.
- **Accessible affordances:** selected card and territory remain visibly outlined; compact information stays text-readable and keyboard focus rings remain visible; rule explanations remain accessible through individual card inspection.

The UI is defined in `arena/combat-v5.css` and the live-state presentation in `arena/app.js`. It does **not** change the match engine or CPU rules.

## Automated acceptance

`tests/arena_combat_ui_browser.py` checks:
- widths **320, 390, 768, 1024, 1120, 1366, 1600**, all with viewport height 768px;
- desktop three-column composition: tactical rail and controls genuinely beside the board;
- at 1366px and above, **battlefield, action controls and hand bottom stay within the 768px viewport**;
- responsive quick-nav and no mobile horizontal overflow;
- armed tactical portrait, Focus cost, cancel, active target, odds, action steps, playable lock;
- a complete shared dealer CPU resolution and next-turn transition.

Measured in Chromium (height 768px):
- 1120px wide: workstation bottom **634px**
- 1366px wide: workstation bottom **666px**
- 1600px wide: workstation bottom **746px**

The existing hotseat browser suite, CPU browser suite and Classic regression suite run unchanged alongside these checks. Node rules tests and the 100,000-match existing exploratory simulation also remain in CI.

## Known limitations

- Tablet and phone use scrollable content rather than squeezing a complete 4×4 battlefield onto one small screen; sticky quick navigation shortens travel.
- Extremely short browser windows, browser zoom above 100%, or unusually large accessibility fonts can require scrolling.
- The user may still inspect and select cards individually; the compressed desktop hand deliberately trades full card artwork size for accessible gameplay.
- No engine, economic progression, ranked server or matchmaking changes are included.
