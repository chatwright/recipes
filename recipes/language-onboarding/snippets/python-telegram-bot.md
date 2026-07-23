---
framework: python-telegram-bot
label: Python (python-telegram-bot)
language: python
kind: predefined
source: https://github.com/python-telegram-bot/python-telegram-bot
---

# python-telegram-bot (v21+, async)

The most widely used Python Telegram framework. Note `base_url` — pointing
an existing bot at Chatwright's emulated Bot API is a one-line change.

```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import (Application, CallbackQueryHandler, CommandHandler,
                          ContextTypes)

LANGUAGES = [("en", "English"), ("es", "Español"), ("fr", "Français")]
GREETINGS = {"en": "Howdy stranger", "es": "¡Hola forastero!", "fr": "Salut l'inconnu"}


async def start(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    keyboard = [[InlineKeyboardButton(label, callback_data=f"lang:{code}")]
                for code, label in LANGUAGES]
    await update.message.reply_text(
        "Choose your language", reply_markup=InlineKeyboardMarkup(keyboard))


async def choose_language(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    code = query.data.removeprefix("lang:")
    await query.edit_message_text(GREETINGS.get(code, GREETINGS["en"]))


app = (
    Application.builder()
    .token("any-token-works-against-the-emulator")
    # Swap api.telegram.org for Chatwright's emulated Bot API:
    .base_url("http://localhost:8080/bot")
    .build()
)
app.add_handler(CommandHandler("start", start))
app.add_handler(CallbackQueryHandler(choose_language, pattern=r"^lang:"))
app.run_polling()
```
