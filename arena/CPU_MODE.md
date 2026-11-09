# Play vs CPU — Arena Solo Mode

The Arena supports **Play vs CPU** alongside the original **Local 2-Player** hotseat option. Both modes use the exact same underlying `arena/engine.js` rules, 4×4 battlegrounds, 52-card common dealer, 12 playable tactical cards, Focus, fatigue, and 18-turn/sudden-death scoring.

## Launch

Open [Play Arena vs CPU](https://raw.githack.com/gulfcoastorganics-ai/high-low-battlegrounds-/arena-play-vs-cpu/arena/index.html). Choose a difficulty in the lobby, then select **⚔ PLAY VS CPU**. Customize your deck as Player One and the CPU's deck as Player Two.

The CPU is Player Two. Once you select a target and lock HIGHER or LOWER, the computer immediately submits its own legal prediction and optional ability. Both actions resolve against **the same next dealer card**, and the card reveal shows both outcomes. There is no pass-device screen in solo mode.

Switch back to two-player hotseat with **LOCAL 2-PLAYER**. Rematches preserve your selected mode, difficulty, and deck lists. Solo mode needs no network connection.

## Three difficulty levels

| Level | Behavior |
| --- | --- |
| Casual | More random targets and occasional incorrect guesses; uses abilities infrequently |
| Standard | Considers revealed-card odds and costs; balances strategy and variety |
| Expert | Evaluates available targets and tactics more consistently with limited decision noise |

The CPU is not granted bonus Focus, altered card odds, an extra tactical hand, additional positions, or access to the next dealer card. Expert is a stronger **heuristic strategy**, not a flawless opponent.

## Fair-information policy

The CPU module is isolated in `arena/cpu.js`. It calculates probability from a snapshot of **only the 16 public opening playing cards** plus dealer draws **already revealed in the current round**. It observes its own board/hand/Focus and the opponent's publicly visible board. The algorithm does not read `match.dealer` or the human's submitted decision in `match.commits[0]`; unit tests explicitly fail if those are accessed. The hidden card is revealed only by the normal engine after both players commit.

The human's decision remains hidden from CPU evaluation. Local JavaScript and developer tools can inspect all client game state, so this does **not** provide tamper-resistant or server-authoritative competitive security.

When regulation ties, a new standard dealer is shuffled for sudden death. The CPU refreshes its 16-card public starting-board snapshot and plays standard predictions without tactical abilities. Sudden death can still end in a draw.

## Architecture

- `arena/engine.js`: original deterministic shared-dealer rules and legal-move validation, unchanged
- `arena/cpu.js`: pure CPU decision policy, public probability calculator, difficulties
- `arena/app.js`: lobby mode selection, solo turn orchestration, result labels, rematches
- `arena/cpu.css`: mobile-friendly CPU launch/selection styling

## QA

```bash
node --check arena/cpu.js
node --test tests/arena_cpu.test.cjs
python tests/arena_cpu_browser.py     # requires Playwright Chromium
```

The GitHub Actions Arena QA also runs the original V8 and hotseat tests and an existing 100,000-match balance smoke test. The 250-match solo harness tests complete legal CPU matches, and Playwright checks solo entry, reveals, no handoff, sudden death, rematches, and responsive layouts at 320, 390, 768 and 1366 pixels.

## Known limitations

- Offline solo bot: no online matchmaking, account identity or live PvP server
- Heuristic AI, not an ML-trained or adaptive opponent
- CPU strategy and current match are local and do not persist through reloads
- Solo rewards and progression are not implemented
