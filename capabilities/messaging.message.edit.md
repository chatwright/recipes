---
key: messaging.message.edit
---

# `messaging.message.edit`

## What it is

The ability to rewrite a message the bot already sent — its text, its
attached buttons, or both — in place, without deleting it and sending a
replacement. It is what turns a stream of vote notifications into one
live-updating surface, and what lets a bot correct itself without leaving a
stale message sitting in the chat.

This capability is what
[collect-rsvp](../recipes/collect-rsvp/implementations/telegram-inline-buttons.md)'s
official implementation uses to keep the RSVP count current on a single
message, paired with
[`messaging.buttons.inline`](messaging.buttons.inline.md) for the tappable
choices themselves.

## Support

Support for `messaging.message.edit` across platforms and emulators is
data, not prose — see
[`data/capabilities/messaging.message.edit.json`](../data/capabilities/messaging.message.edit.json),
the source of truth the website's support table renders from. See
[`data/capabilities/README.md`](../data/capabilities/README.md) for the
shape.
