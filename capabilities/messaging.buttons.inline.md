---
key: messaging.buttons.inline
---

# `messaging.buttons.inline`

## What it is

An inline keyboard is a set of tappable buttons attached to one specific
message — distinct from a platform's persistent reply keyboard, which sits
below the compose box and is attached to the chat, not to a message.
Tapping an inline button typically fires a callback the bot can answer
without sending a new message, which is what makes one-tap choices (RSVP,
polls, menu pickers, confirmations) possible without asking the invitee to
type anything at all.

This capability is what
[collect-rsvp](../recipes/collect-rsvp/implementations/telegram-inline-buttons.md)'s
official implementation is built on, paired with
[`messaging.message.edit`](messaging.message.edit.md) to update the buttons'
host message after each tap.

## Support

Support for `messaging.buttons.inline` across platforms and emulators is
data, not prose — see
[`data/capabilities/messaging.buttons.inline.json`](../data/capabilities/messaging.buttons.inline.json),
the source of truth the website's support table renders from. See
[`data/capabilities/README.md`](../data/capabilities/README.md) for the
shape.
