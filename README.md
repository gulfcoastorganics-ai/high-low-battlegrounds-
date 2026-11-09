# HIGH / LOW: BATTLEGROUND V5

A premium self-contained HTML5 higher/lower card battleground, with an Android app host.

## Play
- The entire **V5 game** is in root [index.html](./index.html). Download it and open in Chrome, or publish the repository with GitHub Pages.
- Offline solo and local pass-and-play PvP both work without a server.
- 3×3 or 4×4 grids; face-up or blind openings; correct predictions replace cards; wrong or equal-rank predictions burn spaces.
- Players in a local duel receive the identical initial board and dealer draw sequence; equal scores trigger a fresh sudden-death deck.

## V5 improvements
- True front/back CSS 3D playing-card faces, staggered dealing, reduced-motion support and sound toggle.
- Probability assistant based only on previously revealed card identities, not the hidden dealer deck.
- Fictional practice credits, difficulty-weighted multipliers, XP, level, achievements represented by statistics, saved solo games and full turn-by-turn replay.
- Emerald, Noir and Ruby table themes; mobile responsive controls.

## Android
The included [Android GitHub Actions workflow](./.github/workflows/android-build.yml) copies the latest root index.html into Android assets and builds a test debug APK. The native Android shell remains a source project until a cloud build succeeds; **a verified installable APK is not yet confirmed**.

1. Open **Actions → Build HIGH LOW Android APK → Run workflow**.
2. When the run finishes successfully, download the `Battleground-V4-Android-APK` artifact; despite the artifact's older label, its bundled game comes from the current root index.html.
3. Unzip and install `app-debug.apk` on an Android device to test.

## Multiplayer caveat
Online PvP is **not connected** in the V5 in-chat/standalone game. The Online tab is an honest roadmap. An authoritative backend with auth, RLS, hidden decks, idempotent moves, matchmaking and independent two-device testing is required. See [Online architecture](./docs/ONLINE_ARCHITECTURE.md).

## Testing
V5 Playwright/Chromium smoke checks were performed for 390×844 and 1100×860 viewports, full solo round, save/resume, progression, probability assistant, hidden blind cards, replay and both local PvP turns. This does **not** establish deployed backend or physical Android QA.

All stakes and rewards are fictional practice credits with no monetary value.