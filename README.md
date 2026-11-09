# HIGH / LOW: BATTLEGROUND V6

A self-contained, offline HTML5 card survival game with optional local head-to-head play and an Android WebView wrapper.

## Play

Open [index.html](./index.html) in a modern browser or host it on a static website. It includes the game engine, UI, CSS 3D cards, sound toggle and simulated practice credits with no build step.

**Core rules:** Deal 3×3 or 4×4 grid from a 52-card deck. Select a card and predict whether the next dealer card ranks higher or lower (aces high). Correct answers replace the card. Wrong answers and equal ranks permanently burn that space. Keep playing until the dealer shoe or playable spaces are gone. Score = number of dealer cards drawn. Local PvP uses the identical initial shuffle for both competitors and gives Player 2 an explicit handoff screen.

## V6 changes

- Atomic draw/save update before animations, preventing lost moves on reload.
- Save replay validation: rejects duplicate cards, invalid directions, forged moves, impossible states and inconsistent history.
- Restored save messages are generated afresh instead of interpreting stored HTML.
- True information-limited probability assistant using only revealed cards.
- Local PvP pass-device privacy interstitial.
- Sticky mobile higher/lower controls, card lighting and tactile styling.
- 100,000 simulated rounds with difficulty analysis and transparent virtual-credit balance warnings.
- Browser and Node test suites, Android workflow and severity-ranked audit.

## Tests

Node 22+ required:

```sh
node --test tests/core.test.cjs
```

Browser tests require Python Playwright and a Chromium binary:

```sh
python -m pip install playwright
python -m playwright install chromium
python tests/browser_checks.py
```

When `/usr/bin/chromium` is absent the browser tests use Playwright's installed Chromium. The browser harness mocks browser storage because local URLs are blocked by the test environment; verify real persistence after deploying.

See [V6 Audit](./docs/V6_RELEASE_AUDIT.md) for results, security limitations, and the simulation balance table.

## Android

GitHub Actions workflow [Build HIGH LOW Android APK](./.github/workflows/android-build.yml) copies the current root `index.html` into the native Android assets and builds the debug APK with Gradle. The artifact is `Battleground-V6-Android-APK`. If the cloud build succeeds, extract and install `app-debug.apk` on an Android test device. Play Store release requires release signing and further testing.

**APK installation is not verified.** A native WebView app is not equivalent to a fully native Android game.

## Online PvP

The Online panel describes a roadmap, not a functioning service. Production multiplayer must use authenticated players, server-side shuffled hidden decks, transactional/idempotent move RPCs, strict RLS, rate limits, reconnect rules and independent two-client tests. Do not deploy the experimental legacy SQL prototypes unchanged.

All stakes are fictional practice credits with no real monetary value. No deposits, withdrawals or cash prizes are supported.

## Merge policy

This is a proposed V6 development branch, not a verified finished online release. Review GitHub Actions, test on an Android device, and approve before merging to main.
