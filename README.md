# Chatwright Recipes

**Recipes for conversational UX. Every recipe runs.**

[![Validate](https://github.com/chatwright/recipes/actions/workflows/validate.yml/badge.svg)](https://github.com/chatwright/recipes/actions/workflows/validate.yml)

This is the Chatwright central index. It holds two things in one
repository, deliberately — splitting them would halve both: Chatwright's
first-party knowledge content, and the federated registry of independently
owned bot repositories that extend it.

Every Recipe here claims to work because it *runs*: a scripted conversation
against a real bot, over an emulated messaging platform, captured as a
replayable run bundle. Not a screenshot, not a claim on a page — a
recording you can drop into the Studio player and watch play back with no
live service required.

## The graph

Content here is one small graph, not a pile of unrelated documents:

```
Job  --(solved by)-->  Recipe  --(realised by)-->  Implementation
                                                       on a Platform
                                                       using Capabilities
```

- A **[Job](jobs/)** is an intent someone wants to accomplish — "collect
  RSVP for an event." Deliberately thin: a title and `solvedBy` links to
  the Recipes that solve it.
- A **[Recipe](recipes/)** is the central content asset: an executable
  answer to one or more Jobs, with the conversation-design problem, an
  annotated transcript, and several Implementations compared honestly.
- An **Implementation** is one Recipe realised on one Platform with one
  technique — tiered **official / alternative / community** (the MDN
  model: never a single recommended answer), with documented advantages,
  disadvantages, and the Capabilities it uses.
- A **[Capability](capabilities/)** is a platform primitive identified by a
  stable dotted key (`messaging.buttons.inline`) — its per-platform support
  lives as [data](data/capabilities/), never hand-authored prose.

See [decision 0011](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0011-executable-knowledge-graph.md)
in the standard repository for the full knowledge-graph model, and
[decision 0013](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0013-chatwright-md-federation.md)
for how this repository federates with independently owned repositories.

## Demos run in the browser

Every Recipe names a canonical demo — a Bot and a Scenario — that runs live
at [chatwright.dev](https://chatwright.dev), entirely client-side: nothing
uploaded, no account required. That browser-runtime wiring is landing now;
until it does, a recorded run bundle is the interim demo (see each Recipe's
*Demo* section). Either way the evidence is real — a replayable recording,
never a placeholder.

## Structure

| Path | Contents |
|---|---|
| [`jobs/`](jobs/) | Job nodes — one Markdown file per intent, with `solvedBy` edges into `recipes/`. |
| [`recipes/`](recipes/) | Recipe nodes, one directory each, with an `implementations/` subdirectory per realisation. |
| [`capabilities/`](capabilities/) | Prose capability pages — what a capability key means; the support table renders from `data/`. |
| [`data/capabilities/`](data/capabilities/) | Machine-readable per-platform compatibility data, one JSON file per capability key — the source of truth. |
| [`registry/`](registry/) | The federation registry: thin pointer rows to independently owned `CHATWRIGHT.md` repositories, plus a manifest cache. |
| [`scripts/`](scripts/) | `validate.mjs` — the dependency-free validator CI runs on every pull request. |

## Contributing

Three ways in — see [CONTRIBUTING.md](CONTRIBUTING.md) for the full quality
bar and conventions:

1. **Write a Recipe** for a Job that doesn't have one yet, or add an
   Implementation to an existing Recipe. Copy the shape of
   [`recipes/collect-rsvp/`](recipes/collect-rsvp/README.md) — the worked
   exemplar every Recipe here follows.
2. **Register your bot repository.** Add a
   [`CHATWRIGHT.md`](https://github.com/chatwright/chatwright/blob/main/formats/chatwright-md/v1/README.md)
   manifest to your own repository — any language, any platform — then open
   a one-row pull request against [`registry/registry.json`](registry/registry.json).
   See [`registry/README.md`](registry/README.md).
3. **Tag it for zero-friction discovery.** Add the GitHub topic
   `chatwright-bot` to your repository. Additive to the curated registry
   above, never a substitute for it.

### The badge

Once your repository has a `CHATWRIGHT.md`, add this to your `README.md` —
it works immediately, no registration required:

```markdown
[![Try in Chatwright](https://chatwright.dev/badge.svg)](https://chatwright.dev/try/github/OWNER/REPO)
```

`https://chatwright.dev/try/github/{owner}/{repo}[/{path}][?ref={branch|tag|sha}]`
resolves the moment `CHATWRIGHT.md` exists in that repository (or the given
subdirectory) — listing here is the optional discovery layer on top.

## Licence

Dual-licensed, MDN-style:

- **Content** — `jobs/`, `recipes/`, `capabilities/*.md`,
  `data/capabilities/*.json`, and this README's prose — is
  [CC BY-SA 4.0](LICENSE-CONTENT).
- **Code and schemas** — `scripts/`, `.github/`, and `registry/registry.json`'s
  format — is [Apache-2.0](LICENSE).

---

An independent open-source project developed by [Sneat.co](https://sneat.co).
