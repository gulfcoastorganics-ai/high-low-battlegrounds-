# Online PvP — V5 server-authoritative architecture

**Status:** Architecture specified, NOT deployed or live-tested. The in-chat game intentionally has no active online matchmaking.

## Required components

- Supabase Auth guest identity with optional account upgrades.
- Queue or private-room invite using short-lived join tokens and abuse limits.
- Backend-only cryptographic 52-card shuffle shared between participants.
- Per-user visible state snapshots. Never send raw decks, next draws, or unrevealed cards to either player.
- Transactional server-side RPC for each move. Validate authenticated seat, valid active board position, HIGHER/LOWER choice, one draw per request, and unique request IDs for idempotency.
- Persist scores authoritatively as number of dealer cards consumed. Match and sudden death decisions are server controlled.
- Supabase Realtime for safe public match events, with polling fallback.
- RLS, locked-down direct table grants, fixed search paths, rate limits, lease expiration, and disconnect/reconnect rules.
- Integration test two independent sessions, simultaneous moves, duplicate requests, guessed tokens, hidden-card leakage and reconnection.

## Release gate
Do not enable ranked or public online games until the backend is deployed and all tests have passed. Offline XP/credits in localStorage are decorative and must never be treated as authoritative online assets. No cash bets, deposits, withdrawals or prizes.

## Game invariants
3×3 uses 9 initial cards, leaving 43 dealer draws; 4×4 uses 16 initial cards, leaving 36. Correct prediction replaces that board card. Miss or equal rank burns the selected space. Last dealer card or no spaces remaining ends the run. Head-to-head players face the identical initially shuffled deck; ties use a fresh common deck.