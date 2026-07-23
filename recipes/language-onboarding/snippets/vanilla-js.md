---
framework: vanilla-js
label: Vanilla JS
language: javascript
kind: predefined
source: https://github.com/chatwright/greetbot
---

# Vanilla JavaScript

No framework — exactly what the live [greetbot](https://github.com/chatwright/greetbot)
does. `api(method, params)` is any function that POSTs to a Bot API root:
the real `api.telegram.org`, or Chatwright's emulated one.

```js
const LANGUAGES = [["en", "English"], ["es", "Español"], ["fr", "Français"]];
const GREETINGS = { en: "Howdy stranger", es: "¡Hola forastero!", fr: "Salut l'inconnu" };

async function onUpdate(update, api) {
  if (update.message?.text === "/start") {
    await api("sendMessage", {
      chat_id: update.message.chat.id,
      text: "Choose your language",
      reply_markup: {
        inline_keyboard: LANGUAGES.map(([code, label]) => [
          { text: label, callback_data: `lang:${code}` },
        ]),
      },
    });
  } else if (update.callback_query?.data?.startsWith("lang:")) {
    const q = update.callback_query;
    await api("editMessageText", {
      chat_id: q.message.chat.id,
      message_id: q.message.message_id,
      text: GREETINGS[q.data.slice(5)] ?? GREETINGS.en,
    });
    await api("answerCallbackQuery", { callback_query_id: q.id });
  }
}
```
