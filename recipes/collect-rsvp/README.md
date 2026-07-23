---
id: collect-rsvp
title: Collect RSVP for an event
jobs: [collect-rsvp-for-event]
status: draft
---

# Collect RSVP for an event

This is Chatwright's worked exemplar — the Recipe every future Recipe in
this index should copy the shape of. It solves the
[collect-rsvp-for-event](../../jobs/collect-rsvp-for-event.md) Job.

## About

"Collect an RSVP" looks solved — every messaging platform has *something*
for polls or buttons — but it is actually a small, real conversation-design
space. How much friction can an invitee tolerate before they just don't
reply? What happens when someone taps "in" on Monday and needs to change
their mind on Thursday — is that a vote change or a duplicate vote? How
does the organiser see a live count without polling the chat themselves or
scrolling past a dozen individual replies? And what happens when the
platform doesn't have anything like a button at all — do you fall back
gracefully, or does the whole approach just not work there?

Three genuinely different, sound answers exist to this Job, each trading
something for something else. That is exactly the shape Chatwright exists
to make comparable — never a single "best" implementation, three tiered,
honestly-compared ones.

## The conversation

An annotated transcript of the official Telegram implementation. The bot
sends one message and keeps editing it in place as votes come in — no new
message per vote, no polling required.

```
Bot:      🎉 Team dinner, Friday 19:00 @ Otto's.
          Are you in?
          [ ✅ I'm in ]  [ ❌ Can't make it ]  [ 🤔 Maybe ]

Alex:     *taps* ✅ I'm in

Bot:      🎉 Team dinner, Friday 19:00 @ Otto's.
          Are you in?
          ✅ 1 · ❌ 0 · 🤔 0
          [ ✅ I'm in ]  [ ❌ Can't make it ]  [ 🤔 Maybe ]
          ^ same message, edited in place — no new notification,
            the count updates live for everyone with the chat open

Priya:    *taps* 🤔 Maybe

Bot:      ✅ 1 · ❌ 0 · 🤔 1
          [ ✅ I'm in ]  [ ❌ Can't make it ]  [ 🤔 Maybe ]

Alex:     *taps* ❌ Can't make it
          ^ Alex changes their mind — the bot reads the second tap
            from the same user as a vote change, not a duplicate

Bot:      ✅ 0 · ❌ 1 · 🤔 1
          [ ✅ I'm in ]  [ ❌ Can't make it ]  [ 🤔 Maybe ]
```

Three design points worth naming: **one persistent surface** (a single
edited message, not a growing thread of vote notifications), **vote-change
handling** (a second tap from the same identity replaces, never
duplicates), and a **live, ambient count** (nobody has to ask "who's in so
far?").

## Implementations

| Implementation | Tier | Platform | Trade-off |
|---|---|---|---|
| [Telegram inline buttons](implementations/telegram-inline-buttons.md) | official | Telegram | One-tap and a live edited count, but no room for free-text nuance |
| [Universal numbered replies](implementations/universal-numbered-replies.md) | alternative | any | Works everywhere, including plain SMS, but typo-prone with no visual affordance |
| [AI conversation](implementations/ai-conversation.md) | alternative | any | Handles natural-language nuance, at the cost of latency, spend and a verification burden |

## Trade-offs

None of the three is strictly better — that is the point of tiering
Implementations rather than picking one. **Telegram inline buttons** gives
the best invitee experience on Telegram specifically: one tap, a message
that visibly updates, and near-zero chance of a malformed reply — but the
capabilities it depends on (`messaging.buttons.inline`,
`messaging.message.edit`) simply do not exist on every platform, and the
implementation cannot capture "in, but running 15 minutes late" without a
follow-up message. **Universal numbered replies** is the only one of the
three that works on a platform with no button affordance at all, such as
plain SMS — but it pushes the parsing burden onto matching free text
against expected digits or words, which is genuinely typo-prone, gives the
invitee nothing to tap, and turns every vote into a fresh message rather
than one live surface. **AI conversation** is the most forgiving to the
invitee — it tolerates real phrasing variance and can capture a plus-one or
a caveat in the same reply — but it is the only one of the three with a
real per-message cost, real latency, and a verification burden: its
correctness has to be evaluated against example transcripts rather than
asserted deterministically, so it earns the `alternative` tier on the same
grounds as the numbered-replies implementation, for different reasons.

Pick based on what the invitee's platform actually offers and how much
nuance the organiser genuinely needs — not by assuming the fanciest
implementation is the right one.

## Demo

Runs in the browser at [chatwright.dev](https://chatwright.dev) — wiring
lands with the browser runtime; recorded run bundles are the interim demo.

## Testing

A scripted scenario drives the Telegram Platform Emulator through the exact
transcript above: send the event message, simulate each tap as a
`callback_query`, and assert the tallied count and the edited message's
rendered text after every tap — including the vote-change case, where the
assertion checks that the old choice's count decrements and the new
choice's increments, not that a fourth vote appears from nowhere. The run
is captured as a `*.chatwright.json` run bundle — the format is
[`https://chatwright.dev/formats/run-bundle/v1`](https://github.com/chatwright/chatwright/blob/main/formats/run-bundle/v1/schema.json)
— which anyone can replay in the Studio player with no live emulator, no
service, and no network. That replayable bundle, not this prose, is what
"the recipe runs" means.

## References

- Job: [collect-rsvp-for-event](../../jobs/collect-rsvp-for-event.md)
- Decision [0011 — executable knowledge graph](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0011-executable-knowledge-graph.md)
- Decision [0013 — CHATWRIGHT.md federation](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0013-chatwright-md-federation.md)
- [Run bundle format](https://github.com/chatwright/chatwright/blob/main/formats/run-bundle/v1/schema.json)
- [Telegram Bot API — inline keyboards](https://core.telegram.org/bots/api#inlinekeyboardmarkup)
