---
title: RSVP via Telegram inline buttons
recipe: collect-rsvp
tier: official
platform: telegram
capabilities: [messaging.buttons.inline, messaging.message.edit]
---

# RSVP via Telegram inline buttons

**Tier:** official · **Platform:** Telegram

## How it works

The bot sends the event message with an inline keyboard —
`reply_markup.inline_keyboard` — carrying three buttons, each with a
`callback_data` value identifying the vote choice. When an invitee taps a
button, Telegram delivers a `callback_query` to the bot, not a new chat
message. The bot updates its own tally, answers the callback query (which
clears the tap's loading spinner), and calls `editMessageText` (with an
updated `reply_markup`) to rewrite that same message with the new counts.
Every invitee who has the chat open sees the same single message change in
place — no new notification, no growing thread.

A second tap from the same platform identity is read as a vote change: the
bot decrements the tally for the invitee's previous choice before
incrementing the new one, rather than recording a second vote.

## Pros

- **One-tap response.** Near-zero friction — no typing, no format to get
  wrong.
- **Edit-in-place.** The chat stays clean: one message updates, instead of
  a new "X voted" message per tap cluttering the conversation.
- **Live, ambient count.** Every participant sees the running tally without
  asking or polling.
- **Vote changes are a second tap**, not a support request or a manual
  correction.

## Cons

- **Telegram-specific.** Depends on `messaging.buttons.inline` and
  `messaging.message.edit`, which are not available — or are only
  partially available — on every platform; see each capability's
  [compatibility data](../../../data/capabilities/).
- **Needs a live bot process.** A webhook or long-poll listener has to be
  running to receive `callback_query` updates.
- **No free-text nuance.** An invitee cannot express "in, but running 15
  minutes late" or "bringing a plus-one" without sending a separate
  message — the button only carries the three fixed choices.
