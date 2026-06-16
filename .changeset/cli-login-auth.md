---
"microfox": minor
---

Add `microfox login` / `microfox logout` (device-authorization flow) and authenticate cicd
requests.

`login` opens the browser to approve a short code, polls cicd for a minted token, and stores it
in `~/.microfox/credentials.json` (mode 600). `push` and `status` now send
`Authorization: Bearer <token>` + `x-microfox-service-key` on v2 cicd requests, and `push`
prints a "run `microfox login`" hint on 401. `MICROFOX_TOKEN` / `MICROFOX_SERVICE_KEY` env vars
override for CI. Until cicd sets `CICD_AUTH_ENFORCE=true`, unauthenticated pushes still work
(warn-only rollout).
