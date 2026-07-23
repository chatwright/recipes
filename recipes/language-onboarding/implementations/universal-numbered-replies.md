---
title: Language onboarding via universal numbered replies
recipe: language-onboarding
tier: alternative
platform: any
capabilities: [messaging.text]
---

# Language onboarding via universal numbered replies

**Tier:** alternative · **Platform:** any

## How it works

The bot sends a plain-text numbered menu — "Choose your language:\n1)
English\n2) Español\n3) Français" — on a chat's first message, whatever
its content. The next inbound text message is parsed for a matching digit
(a 1-based position in the list) or the language's own name, case-
insensitively. A match records the choice and sends the greeting as a
**new** plain-text message — there is no message to edit in place on a
platform with no edit endpoint.

Because the only capability this depends on is sending and receiving plain
text, it works on every platform Chatwright models — including ones with
no button, keyboard, or message-edit affordance at all.

**Live implementation:** [chatwright/greetbot](https://github.com/chatwright/greetbot)'s
WhatsApp adapter (`whatsapp/bot.js`) is a live implementation of this
technique — the WhatsApp Cloud API has neither inline buttons nor a
message-edit endpoint, so it degrades from the
[official Telegram inline-buttons implementation](telegram-inline-buttons.md)
to exactly this numbered-reply menu, reusing the same platform-neutral
conversation logic in `shared/greet.js` unchanged. Live at
[chatwright.github.io/greetbot/whatsapp](https://chatwright.github.io/greetbot/whatsapp/).

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

- **Typo-prone.** A stray space, an unrecognised language name, or a reply
  sent to the wrong thread can all fail to match and go unrecorded.
- **No visual affordance.** Nothing nudges the user toward the expected
  reply format the way a labelled button does.
- **The greeting is always a new message.** On a platform with a
  message-edit endpoint (Telegram), the official implementation edits the
  original greeting in place instead; this technique never can.
