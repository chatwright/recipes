---
title: Language onboarding via Telegram inline buttons
recipe: language-onboarding
tier: official
platform: telegram
capabilities: [messaging.buttons.inline, messaging.message.edit]
---

# Language onboarding via Telegram inline buttons

Send the greeting with an `inline_keyboard` of language options; on the
`callback_query`, call `editMessageText` to rewrite the greeting in the
chosen language.

**Source & demo:** [chatwright/greetbot](https://github.com/chatwright/greetbot)
— the platform-neutral conversation logic lives in `shared/greet.js`, the
Telegram adapter in `telegram/bot.js` (~100 lines, no framework, no build
step). Live at
[chatwright.github.io/greetbot](https://chatwright.github.io/greetbot/).

## Advantages

- One tap, zero typing — and since greetbot v0.2.1 the buttons carry numbered labels ("English (1)") with typed digits/names accepted too, so the button and numbered-reply techniques coexist on Telegram.
- The in-place edit keeps history clean and confirms the choice on the
  message the user acted on.

## Disadvantages

- Requires inline-keyboard and message-edit support — not portable to
  platforms without them (see the capability data for per-platform
  support).
- Callback data carries the choice; long option lists need pagination.
