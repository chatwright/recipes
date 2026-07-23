---
key: messaging.text
---

# `messaging.text`

## What it is

A plain text message — no attachments, no buttons, no formatting beyond
what the platform's own message body supports. It is the one primitive
every conversational platform Chatwright emulates has in common, and the
baseline every other messaging capability (`messaging.buttons.inline`,
`messaging.message.edit`, …) is layered on top of.

Because it is universal, `messaging.text` is also what a text-first
scenario — a numbered menu, a plain-language onboarding flow, anything
that never relies on a tap-target — can run unmodified across every
platform Chatwright emulates, including a platform (WhatsApp, in this
runtime pair's current slice) that has no interactive-button emulation yet.

## Support

Support for `messaging.text` across platforms and emulators is data, not
prose — see
[`data/capabilities/messaging.text.json`](../data/capabilities/messaging.text.json),
the source of truth the website's support table renders from. See
[`data/capabilities/README.md`](../data/capabilities/README.md) for the
shape.
