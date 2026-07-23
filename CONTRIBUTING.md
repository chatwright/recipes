# Contributing to chatwright/recipes

This is the Chatwright central index: first-party Jobs, Recipes and
Capabilities (with their compatibility data), plus the
[federation registry](registry/README.md) of independently owned bot
repositories. See decisions
[0011](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0011-executable-knowledge-graph.md),
[0013](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0013-chatwright-md-federation.md)
and
[0014](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0014-community-metrics.md)
in the standard repository for the model this content follows.

## What you can contribute

- **A Recipe** — a new executable answer to a Job, following the shape of
  [`recipes/collect-rsvp/`](recipes/collect-rsvp/README.md): About, The
  conversation, Implementations, Trade-offs, Demo, Testing, References.
- **An Implementation** — another platform or technique for an existing
  Recipe, added to that Recipe's `implementations/` directory and its
  comparison table.
- **A registration** — a pull request adding one row to
  [`registry/registry.json`](registry/registry.json) for your own
  `CHATWRIGHT.md`-carrying repository. See
  [`registry/README.md`](registry/README.md).

## Quality bar: executable-first

Chatwright's premise is "every recipe runs." A Recipe or Implementation
without at least a **recorded run bundle** demonstrating it is
`status: draft` — draft content is welcome, but it is explicitly marked as
not yet proven, and doesn't get promoted out of draft until a
`*.chatwright.json` run bundle (or a link to one) backs its claims. Prose
describing behaviour that hasn't actually been run is a plan, not a Recipe.

## Tiers

Implementations carry exactly one tier, per
[decision 0011](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0011-executable-knowledge-graph.md)
— the MDN model, never a single recommended answer:

- **official** — the platform-idiomatic technique, using the platform's
  native affordances as intended.
- **alternative** — a sound technique with real, honestly-documented
  trade-offs against the official one (works more broadly, costs more, is
  less nuanced, and so on).
- **community** — contributed and maintained outside the core team, held to
  the same evidence bar, with less editorial curation.

## Front-matter conventions

- Jobs (`jobs/<id>.md`): `id`, `title`, `solvedBy` (recipe ids), `related`
  (job ids).
- Recipes (`recipes/<id>/README.md`): `id`, `title`, `jobs` (job ids),
  `status` (`draft`, ...), `tags` (kebab-case discovery tags — e.g. `start`,
  `game`, `checkout`; they become search facets on chatwright.dev).
- Implementations (`recipes/<id>/implementations/<slug>.md`): `title`,
  `recipe`, `tier` (`official` | `alternative` | `community`), `platform`,
  `capabilities` (capability keys).
- Capabilities (`capabilities/<key>.md`): `key`, matching the filename and
  the corresponding `data/capabilities/<key>.json`.
- Code snippets (`recipes/<id>/snippets/<framework>.md`): `framework`
  (kebab-case slug), `label` (tab caption), `language` (fence language),
  `kind` (`predefined` today; generated kinds arrive with research item
  I-77), optional `source` URL. One framework per file — the site renders
  a recipe's snippets as a tabbed Code card. Snippets must be idiomatic
  for their framework (verified against its real API, not guessed) and
  should show how to point the bot at Chatwright's emulated platform API.
- `id` values are kebab-case and unique across `jobs/` and `recipes/` —
  `node scripts/validate.mjs` checks this, and every `solvedBy`/`jobs`
  cross-reference, before you open a pull request.

## Language

Documentation in this repository uses British English (*licence*,
*behaviour*), per the
[glossary](https://github.com/chatwright/chatwright/blob/main/docs/glossary.md#writing-conventions).

## Developer Certificate of Origin (DCO)

Same as the standard repository: every commit must be signed off.

```bash
git commit -s -m "your commit message"
```

This adds a `Signed-off-by:` trailer certifying you have the right to
submit the change under this repository's licences — content under
CC BY-SA 4.0, code and schemas under Apache-2.0, see
[README.md#licence](README.md#licence). Pull requests with unsigned commits
will be asked to amend before merge.

## Before you open a pull request

```bash
node scripts/validate.mjs
```

Runs offline — no installs, no network — and checks `registry.json`'s shape
and id uniqueness, plus the Jobs/Recipes id graph (collisions and dangling
references). Fix any reported errors; the same command runs in CI.
