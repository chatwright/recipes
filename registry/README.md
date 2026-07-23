# The federation registry

Thin pointer rows into repositories that carry their own
[`CHATWRIGHT.md`](https://github.com/chatwright/chatwright/blob/main/formats/chatwright-md/v1/README.md)
manifest. Per
[decision 0013](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0013-chatwright-md-federation.md),
the registry is deliberately thin: your repository stays the source of
truth for your bot, your Implementations, and your manifest's `version`;
this index only points at it and caches a manifest snapshot for resilience
(see [`cache/README.md`](cache/README.md)).

`registry.json` starts empty — there is no entry here until the first
repository registers.

## Registering

Registering is a pull request adding **one row** to
[`registry.json`](registry.json):

```jsonc
// Example shape — NOT a live entry. registry.json's entries array is
// empty until the first repository registers.
{
  "id": "acme-rsvp-bot",
  "repo": "https://github.com/acme-dev/rsvp-bot",
  "category": "implementation",
  "capabilities": ["messaging.buttons.inline", "messaging.message.edit"],
  "addedAt": "2026-07-23"
}
```

Add your repository's `CHATWRIGHT.md` first — the
[`Try in Chatwright` badge](../README.md#the-badge) and the
`chatwright.dev/try/github/...` route work the moment that file exists, no
registration required. Registering here is the optional discovery layer on
top of that, plus the [central index](../README.md) content it lives
alongside.

## id is identity

`id` is never derived from the repository name — names are transferable and
squattable, `id` is not. The `id` in your registry row must exactly match
the `id` declared in your `CHATWRIGHT.md` front matter. A registry PR whose
`id` doesn't match the fetched manifest's `id` fails validation.

## specFirst

`specFirst` is an **optional boolean** row field:

```jsonc
{
  "id": "acme-rsvp-bot",
  "repo": "https://github.com/acme-dev/rsvp-bot",
  "category": "implementation",
  "capabilities": ["messaging.buttons.inline", "messaging.message.edit"],
  "addedAt": "2026-07-23",
  "specFirst": true
}
```

Set it to `true` if your repository carries SpecScore specs — a
`specscore.yaml` plus at least one main Idea or Feature under `spec/` (see
[chatwright/bot-template](https://github.com/chatwright/bot-template) for a
worked starting point). It renders as a quality chip next to your entry in
the registry listing — **it is never a registration requirement.** Omit the
field entirely if it doesn't apply; leaving it unset is equivalent to
`false` and carries no penalty.

## What validation runs

On every pull request touching `registry.json`, automation:

1. Checks `id` uniqueness across all entries.
2. Fetches the linked repository's `CHATWRIGHT.md` and validates its front
   matter against
   [`formats/chatwright-md/v1/schema.json`](https://github.com/chatwright/chatwright/blob/main/formats/chatwright-md/v1/schema.json)
   in the standard repository.
3. Confirms the fetched manifest's `id` matches the row's `id`.

[`scripts/validate.mjs`](../scripts/validate.mjs) in this repository runs
the offline half of this — shape and uniqueness — with no network access;
the manifest fetch and schema check run in CI on the pull request, where
network access is available.

## Liveness

Once merged, a scheduled check re-fetches each entry's manifest and pings
its declared demo bot endpoints. A row that fails — the manifest no longer
parses, no git tag matches its declared `version`, a demo endpoint doesn't
respond — gets a visible staleness label. Never silent removal, and never
manual re-review: that is the direct antidote to awesome-list rot, where
liveness is assumed rather than checked.

## The cache

Each successful liveness check refreshes a cached manifest snapshot under
[`cache/`](cache/README.md), keyed by `id@version`. The cache exists so a
deleted, renamed, or force-pushed upstream repository doesn't break every
badge and demo embedded elsewhere on the web — the Go-module-proxy lesson.
It is explicitly labelled as a cache and is never the source of truth: that
is always the `CHATWRIGHT.md` in the origin repository.
