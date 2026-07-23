---
title: RSVP via an AI conversation
recipe: collect-rsvp
tier: alternative
platform: any
capabilities: [messaging.text]
---

# RSVP via an AI conversation

**Tier:** alternative · **Platform:** any

## How it works

The bot poses the RSVP question in natural language and hands every reply
to a language model prompted to extract an RSVP decision — and optionally a
note — from free text. This tolerates phrasing the two deterministic
implementations cannot: "can't make it, sorry", "maybe, depends on work",
or "put me down as a yes and I'll bring my partner too" all resolve to a
decision (and, in the last case, a captured note) in a single reply, with
no fixed reply format for the invitee to match.

When the model's confidence in the extracted decision is low, the bot asks
a clarifying question instead of silently recording a guess.

## Pros

- **Handles genuine natural-language nuance** that neither the button nor
  the numbered-reply implementation can — caveats, plus-ones, changed
  plans, all in one message.
- **One message, not a reply-plus-follow-up.** The invitee doesn't need a
  second message to add context.
- **Degrades to a clarifying question** rather than mis-recording an
  ambiguous reply as a confident yes or no.

## Cons

- **Real per-message cost and latency**, unlike the two deterministic
  implementations.
- **Behaviour depends on model version and prompt.** It needs an
  example-based evaluation set to check accuracy over time, not the fixed
  assertions a deterministic implementation can rely on.
- **Every extracted intent needs verification.** Trusting this
  implementation at the same evidentiary bar as the other two means
  building and maintaining that evaluation set — not just eyeballing a
  handful of transcripts — which is a real, ongoing cost this Recipe's
  other two Implementations don't carry.
