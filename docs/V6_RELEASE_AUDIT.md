# HIGH / LOW: BATTLEGROUND V6 — Source Audit and Release Status

**Branch:** `v6-audit-upgrade` (main is unchanged).
**Scope:** Existing standalone HTML5 game, 3×3/4×4 modes, blind/face-up, local pass-and-play PvP, practice credits, XP, replay, Android launcher and workflows.

## Severity-ranked findings

| Severity | Finding | V6 action / status |
|---|---|---|
| High | Dealer draw was removed before the timed flip committed a move; reload / exit during animation could create a broken save | **Fixed**: draw, board change, move log, visible-known set and save are committed before cosmetic animation |
| High | Saved sessions accepted duplicate cards / inconsistent replay snapshots; a saved message was inserted into `innerHTML` | **Fixed**: full 52-card uniqueness, replay verification, position/direction/outcome and known-card validation; saved markup is not rendered |
| Medium | Local PvP passed directly from Player 1's visible results to Player 2 | **Fixed**: explicit pass-device privacy interstitial hides the previous replay before next turn |
| Medium | Probability information could be mistaken for guaranteed dealer distribution | **Clarified**: estimates use only revealed cards; true hidden shoe order remains unavailable |
| Medium | Game difficulty differs dramatically by board size | **Measured** in 100,000 simulated rounds; virtual multipliers still need design approval |
| Medium | UI needed stronger mobile action placement | **Improved**: sticky thumb controls respecting bottom safe area; CSS selection and perspective effects |
| High | Public multiplayer lacks deployed, independently tested secure backend | **Not completed**; backend roadmap remains non-operational |
| Medium | Android app deployment requires cloud compilation and hardware QA | **Cloud compile passed** in GitHub Actions; emulator/physical installation and performance remain pending |
| Low | Replay snapshots stored per turn (rather than compressed events) | **Deferred**; maximum ~44 turns is acceptable for offline performance |

## Gameplay invariants checked

- 52 unique ranks/suits, aces high, 9 or 16 initial cards, dealer pile of 43 or 36.
- Correct prediction: replace card; incorrect/tie: permanently burn position.
- Score = dealer draws consumed. Stop at no live positions or empty dealer shoe.
- Blind starting cards remain concealed until used; probability helper sees revealed cards only.
- Local duel uses same opening deck and draw order; ties repeat with a new shuffle.
- All virtual credits and XP are device-local and untrusted for online play.

## QA completed in controlled environment

- **36 Node rules / recovery tests passed** using the production HTML's embedded rules source (initial V6 implementation).
- **Chromium browser checks passed** at widths 360, 390 and 1100: solo full round, interrupted-animation recovery, resume, interactive replay, blind secrecy, local duel, handoff, stored-message injection.
- Mobile screenshot at 390×844 has no horizontal overflow.
- Tests saved in `tests/core.test.cjs` and `tests/browser_checks.py`, run in GitHub Actions via `.github/workflows/game-qa.yml`.
- Simulations use 100,000 total rounds across 4 difficulty combinations and 2 strategies, reproducible seed 20261108.
- **Android debug APK compiled successfully** in GitHub Actions run [42547279136](https://github.com/gulfcoastorganics-ai/high-low-battlegrounds-/actions/runs/42547279136); artifact `Battleground-V6-Android-APK` (1,159,154 bytes).
- **Not verified:** hosted origin storage across real reloads, real Android APK installation and smoothness, Safari/Firefox, public online PvP. Browser test environment uses controlled localStorage mock because test URLs are blocked.

## Simulation results (12,500 rounds per row)

| Difficulty | Strategy | Mean draws | Perfect clear | Virtual return per 100 staked |
|---|---|---:|---:|---:|
| 3×3 face-up | Random | 16.92 | 0.00% | 20.3 |
| 3×3 face-up | Probability-optimized | 30.93 | 13.46% | 96.1 |
| 3×3 blind | Random | 16.99 | 0.00% | 24.5 |
| 3×3 blind | Probability-optimized | 23.49 | 2.61% | 70.2 |
| 4×4 face-up | Random | 29.76 | 14.92% | 50.0 |
| 4×4 face-up | Probability-optimized | 35.97 | 99.14% | 104.4 |
| 4×4 blind | Random | 29.73 | 14.82% | 62.0 |
| 4×4 blind | Probability-optimized | 34.48 | 73.66% | 114.4 |

These strategy models are not real player data, and may not predict strategic human play perfectly. **Balance warning:** 4×4 optimal strategy inflates virtual returns above 100%; leave these credits explicitly fictional until retuning and retesting.

## Planned but not implemented

- Production Supabase Auth, transactional server-owned deck and moves, restricted RLS, private invite rooms, queue, live score events, reconnect handling, and real two-client tests.
- Android emulator or physical-device installation, gameplay and performance QA report.
- 60 FPS hardware measurements and comprehensive accessibility audit.
- New art assets and 3D models beyond existing CSS 3D card faces.

## Release gate

Do not merge this PR as a full online/mobile production release until build checks succeed, at least one actual APK installation passes, and public network game security has been validated. Standalone HTML5 solo/local modes are the current playable deliverable. Real money payments, payouts, and deposits are deliberately excluded.
