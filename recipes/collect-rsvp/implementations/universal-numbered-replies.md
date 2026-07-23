---
title: RSVP via universal numbered replies
recipe: collect-rsvp
tier: alternative
platform: any
capabilities: [messaging.text]
---

# RSVP via universal numbered replies

**Tier:** alternative · **Platform:** any

## How it works

The bot sends a plain-text message asking the invitee to reply with a
number — "Reply 1 for yes, 2 for no, 3 for maybe" — then parses the next
inbound text message for a matching digit, or a small set of recognised
words ("yes", "in", "no", "out", "maybe"). Each recognised reply produces a
fresh plain-text message from the bot with the updated tally. A second
reply from the same identity is treated as a vote change on the same
matching logic used for the first vote.

Because the only capability this depends on is sending and receiving plain
text, it works on every platform Chatwright models — including ones with no
button, keyboard or rich-message affordance at all, such as SMS or email.

## Pros

- **Works everywhere.** No dependency on inline keyboards, quick replies,
  or any platform-specific UI primitive — plain text send/receive is
  enough.
- **Trivial to implement and test.** No callback wiring, no message
  editing; the logic is a straightforward text match.
- **Degrades to nothing more than the lowest common denominator on
  purpose** — that is the point of the `alternative` tier here: it is the
  fallback that always works, not the best experience anywhere.

## Cons

- **Typo-prone.** A stray space, "yess", "1." with a trailing period, or a
  reply sent to the wrong thread can all fail to match and go unrecorded.
- **No visual affordance.** Nothing nudges the invitee toward the expected
  reply format the way a labelled button does.
- **Every vote is a new message.** The chat fills with tally updates
  instead of presenting one live, persistent surface.
- **Vote changes require re-parsing free text** and disambiguating a
  change from a first-time vote, with no explicit signal that a change was
  intended.
