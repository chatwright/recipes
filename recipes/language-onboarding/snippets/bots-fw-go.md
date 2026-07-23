---
framework: bots-fw
label: bots-fw (Go)
language: go
kind: predefined
source: https://github.com/bots-go-framework/bots-fw
---

# bots-go-framework / bots-fw (Go)

Two command definitions: `/start` sends the keyboard; the `lang` callback
edits the greeting in place. State travels in the callback data as URL
query parameters — the bots-fw convention.

```go
package greetbot

import (
	"net/url"

	"github.com/bots-go-framework/bots-api-telegram/tgbotapi"
	"github.com/bots-go-framework/bots-fw/botmsg"
	"github.com/bots-go-framework/bots-fw/botsfw"
)

var greetings = map[string]string{
	"en": "Howdy stranger", "es": "¡Hola forastero!", "fr": "Salut l'inconnu",
}

var startCommand = botsfw.Command{
	Code:     "start",
	Commands: []string{"/start"},
	Action: func(whc botsfw.WebhookContext) (m botmsg.MessageFromBot, err error) {
		m.Text = "Choose your language"
		m.Format = botmsg.FormatText
		m.Keyboard = tgbotapi.NewInlineKeyboardMarkup(
			[]tgbotapi.InlineKeyboardButton{
				tgbotapi.NewInlineKeyboardButtonData("English", "lang?c=en"),
				tgbotapi.NewInlineKeyboardButtonData("Español", "lang?c=es"),
				tgbotapi.NewInlineKeyboardButtonData("Français", "lang?c=fr"),
			},
		)
		return
	},
}

var langCommand = botsfw.NewCallbackCommand("lang",
	func(whc botsfw.WebhookContext, callbackURL *url.URL) (m botmsg.MessageFromBot, err error) {
		greeting := greetings[callbackURL.Query().Get("c")]
		if greeting == "" {
			greeting = greetings["en"]
		}
		return whc.NewEditMessage(greeting, botmsg.FormatText)
	},
)
```

Testing: the Go runtime drives this bot over real HTTP —
`go get chatwright.dev/runtime`, point the bot at the emulated
`BotAPIURL()`, and the greetbot scenario in
[runtime-go's examples](https://github.com/chatwright/runtime-go) asserts
the keyboard and the in-place edit deterministically.
