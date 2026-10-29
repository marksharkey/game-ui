# PrecisionPros Game UI

Shared React components and styles used by the PrecisionPros game frontends.

## Purpose

Keep game branding, status pages, buttons, and responsive layout consistent. Game-specific behavior stays in each game repository; reusable presentation and routines belong here.

## Release procedure

1. Run the package tests/build checks in each consuming game.
2. Commit and push the shared change.
3. Create and push a version tag such as `v0.3.0`.
4. Update each consumer's package dependency and lockfile.
5. Build and deploy each affected game.

## Hub-owned shortcuts (v0.3.0)

`GameHeader` and `LeaderboardFrame` now render `HubGameShortcuts` using the Hub's
`/api/games/context/` response. Game membership, ordering, badges, colors, play
URLs, leaderboard URLs and `leaderboard_ready` come from the Hub registry.
Legacy `links` props are ignored. New games require a Hub registry change only.
Custom page headers should use `HubGameShortcuts`, not maintain another list.

Set `REACT_APP_HUB_API_URL` to the Hub API root, or pass `contextUrl` to the
shortcut component/header. The Hub token is retained on every destination.
The current game is excluded by key and origin. Context refreshes on return to
the page and every minute; unavailable context leaves Home available and shows
an explicit message instead of guessing status from local data.

v0.3.1 requests `games/context/?shortcuts=1`: the Hub returns the same registry
and authoritative daily state, including live-status fallback, while omitting
unrelated honors and leaderboard calculations. Status consumers and headers
share in-flight requests per URL and authentication token. Responses are not
kept in a client cache, so a new request after completion sees current state.
