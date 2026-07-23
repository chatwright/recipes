---
id: language-onboarding
title: Language onboarding
jobs: [onboard-users-in-their-language]
status: draft
tags: [start, onboarding, i18n]
---

# Language onboarding

Greet a new user, offer a language choice, and continue in the language
they pick — editing the original greeting in place rather than flooding
the chat with a second message.

## The conversation

```
user:  /start
bot:   Choose your language
       [English] [Español] [Français]
user:  taps [English]
bot:   (edits the greeting in place) → "Howdy stranger"
```

The in-place edit is the design point: the chat history stays one message
deep, and the user sees their choice take effect on the message they acted
on.

## Implementations

| Implementation | Tier | Platform | One-line trade-off |
|---|---|---|---|
| [Inline buttons + message edit](implementations/telegram-inline-buttons.md) | official | telegram | One tap, zero typing; needs button + edit support |
| [Universal numbered replies](implementations/universal-numbered-replies.md) | alternative | any | Works everywhere; typo-prone, no visual affordance, greeting is always a new message |

More implementations welcome (see [CONTRIBUTING](../../CONTRIBUTING.md)).

## Demo

Both implementations are **live** in
[chatwright/greetbot](https://github.com/chatwright/greetbot) — a
no-framework, no-build iframe bot speaking the
[bot protocol](https://chatwright.dev/formats/bot-protocol/v1), hosted at
[chatwright.github.io/greetbot](https://chatwright.github.io/greetbot/):
the official inline-buttons implementation as its Telegram adapter, the
universal-numbered-replies implementation as its WhatsApp adapter. Both
adapters' protocol exchange was proven live in a real browser on
2026-07-23; the in-page Playground demo lands with the browser runtime.

## Code

Per-framework snippets, one file each under [`snippets/`](snippets/) — the
site renders these as a tabbed Code card. Predefined today; deterministic
or AI-assisted generation later (research item I-77).

| Framework | Snippet |
|---|---|
| Vanilla JS (what the live greetbot runs) | [`snippets/vanilla-js.md`](snippets/vanilla-js.md) |
| bots-fw (Go) | [`snippets/bots-fw-go.md`](snippets/bots-fw-go.md) |
| python-telegram-bot | [`snippets/python-telegram-bot.md`](snippets/python-telegram-bot.md) |

## Testing

The Go runtime's greetbot example runs this exact flow as a deterministic
scenario (send `/start`, expect the greeting with the language keyboard,
click, expect the edit) — recorded run bundles of it ship as the Studio
player's samples.

## References

- [Job: onboard users in their language](../../jobs/onboard-users-in-their-language.md)
- Capabilities: `messaging.buttons.inline`, `messaging.message.edit` (official)
  · `messaging.text` (universal numbered replies)
