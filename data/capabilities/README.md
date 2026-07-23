# Capability compatibility data

This directory is the **source of truth** for per-platform support tables
rendered on capability pages ([`capabilities/*.md`](../../capabilities/))
and the website. Prose capability pages never hand-author a support table —
they point here, and the table renders from this data.

One JSON file per capability key, named `<key>.json` with the dots kept
literally (for example `messaging.buttons.inline.json`). The shape is
adapted from [MDN's browser-compat-data](https://github.com/mdn/browser-compat-data),
per [decision 0011](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0011-executable-knowledge-graph.md):

```json
{
  "key": "messaging.buttons.inline",
  "status": "stable",
  "specUrl": "https://core.telegram.org/bots/api#inlinekeyboardmarkup",
  "support": {
    "telegram": { "since": "Bot API 2.0", "notes": "..." },
    "whatsapp": { "partial": true, "notes": "..." }
  },
  "emulators": {
    "chatwright-go": { "supported": true },
    "chatwright-ts": { "supported": false, "notes": "..." }
  }
}
```

## Field notes

- **`key`** — must match the filename (dots literal) and the capability key
  used everywhere else: `CHATWRIGHT.md` manifests, Implementation front
  matter, bot-protocol negotiation, search facets.
- **`status`** — the lifecycle of the capability key itself in Chatwright's
  vocabulary (`stable` for now; more values reserved for later).
- **`specUrl`** — the platform's own official reference for the primitive —
  never a Chatwright doc.
- **`support.<platform>`** — either `since` (a platform version or release
  marker the primitive shipped in), or `partial: true` / `supported: false`
  for reduced or absent support. Every entry may carry an optional `notes`
  string, and should when the precise version is not confidently known —
  prefer a `notes` field flagging that over a precise-looking number nobody
  has verified.
- **`emulators.<emulator-id>`** — Chatwright's own emulator fidelity for
  this capability: `supported: true|false`, plus optional `notes` (for
  example, a runtime that is scaffolded but not yet implemented).

New capability keys get a new file here alongside their
`capabilities/<key>.md` prose stub. Nothing here is generated from the
prose page — it is the other way round: the prose page's Support section
points at this file.
