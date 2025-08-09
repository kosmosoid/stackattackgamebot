package telegram

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/kosmosoid/stackattackbot/internal/logging"
	"github.com/kosmosoid/stackattackbot/internal/service"
	"github.com/mymmrac/telego"
	tu "github.com/mymmrac/telego/telegoutil"
)

type Bot struct {
	bot     *telego.Bot
	service *service.Service
	admins  []int64
}

var _ service.TelegramBot = (*Bot)(nil)

func NewBot(token string) (*Bot, error) {
	bot, err := telego.NewBot(token, telego.WithDefaultLogger(false, true))
	if err != nil {
		return nil, err
	}

	var admins []int64
	adm := os.Getenv("ADMINS")
	if adm != "" {
		a := strings.Split(adm, ",")
		for _, id := range a {
			i, _ := strconv.ParseInt(id, 10, 64)
			admins = append(admins, i)
		}
	}

	return &Bot{
		bot:     bot,
		service: nil,
		admins:  admins,
	}, nil
}

func (b *Bot) SetService(svc *service.Service) {
	b.service = svc
}

func (b *Bot) Start() {
	me, _ := b.bot.GetMe()
	log.Printf("Authorized on account %s", me.Username)

	opt := telego.GetUpdatesParams{
		Timeout: 60,
	}

	updates, _ := b.bot.UpdatesViaLongPolling(&opt)
	defer b.bot.StopLongPolling()

	for update := range updates {
		if update.Message != nil {
			go b.handleMessage(update.Message)
		} else if update.CallbackQuery != nil {
			go b.handleCallback(update.CallbackQuery)
		}
	}
}

func (b *Bot) sendMessage(msg *telego.SendMessageParams) {
	_, err := b.bot.SendMessage(msg)
	if err != nil {
		logging.Debug("Ошибка при отправке сообщения: %v", err)
		return
	}
}

func (b *Bot) SendMessage(chatID int64, text string) {
	msg := tu.Message(tu.ID(chatID), text)
	_, err := b.bot.SendMessage(msg)
	if err != nil {
		logging.Debug("Ошибка при отправке сообщения: %v", err)
		return
	}
}

func (b *Bot) handleMessage(message *telego.Message) {

	if len(message.Entities) > 0 && message.Entities[0].Type == "bot_command" {
		switch message.Text {
		case "/start":
			b.sendWelcomeMessage(message.Chat.ID)
		case "/link":
			b.sendAppLink(message.Chat.ID)
		case "/help":
			b.sendHelpMessage(message.Chat.ID)
		case "/donate":
			b.sendDonationMessage(message.Chat.ID)
		case "/hiscore":
			b.sendHiscoreMessage(message.Chat.ID)
		default:
			b.sendUnknownCommandMessage(message.Chat.ID)
		}
	} else {
		b.sendUnknownCommandMessage(message.Chat.ID)
	}
}

func (b *Bot) handleCallback(callback *telego.CallbackQuery) {
	b.sendWelcomeMessage(callback.Message.GetChat().ID)
}

func (b *Bot) sendWelcomeMessage(chatID int64) {
	msg := tu.Message(
		tu.ID(chatID),
		`Добро пожаловать в игру Super Stack Attack.
Для старта нажми кнопку.
Используй /link для получения ссылки на приложение.
Используй /help для просмотра списка команд.
Используй /donate для поддержки проекта.
Используй /hiscore для просмотра таблицы рекордов.

Welcome to the game Super Stack Attack.
Press button for begin.
Use /link command to get app link.
Use /help command to view commands list.
Use /donate command to support the project.
Use /hiscore command to view hiscore table.`,
	)
	b.sendMessage(msg)
}

func (b *Bot) sendUnknownCommandMessage(chatID int64) {
	msg := tu.Message(tu.ID(chatID), "Извините, я не понимаю эту команду. Используйте /help для просмотра списка команд.")
	b.sendMessage(msg)
}

func (b *Bot) sendHelpMessage(chatID int64) {
	msg := tu.Message(tu.ID(chatID), "Список команд:\n/start - Начать\n/link - Получить ссылку на приложение\n/help - Помощь\n/donate - Поддержать проект\n/hiscore - Таблица рекордов")
	b.sendMessage(msg)
}

func (b *Bot) sendHiscoreMessage(chatID int64) {
	msg := tu.Message(tu.ID(chatID), "Soon!")
	b.sendMessage(msg)
}

func (b *Bot) sendDonationMessage(chatID int64) {
	// ChatID:        id,
	// Title:         title,
	// Description:   description,
	// Payload:       payload,
	// ProviderToken: providerToken,
	// Currency:      currency,
	// Prices:        prices,
	payload := strconv.FormatInt(chatID, 10) + "_star"
	m := tu.Invoice(tu.ID(chatID), "Donation", "Donate to support the project", payload, "", "XTR", tu.LabeledPrice("Donation", 10))
	_, err := b.bot.SendInvoice(m)
	if err != nil {
		logging.Debug("Ошибка при отправке сообщения: %v", err)
		return
	}
}

// func (b *Bot) sendErrorMessage(chatID int64) {
// 	msg := tu.Message(tu.ID(chatID), "Извините, произошла ошибка. Пожалуйста, попробуйте позже.")
// 	b.sendMessage(msg)
// }

func (b *Bot) sendAppLink(chatID int64) {
	appURL := os.Getenv("APP_URL")
	wa := telego.WebAppInfo{URL: appURL}

	k := tu.InlineKeyboard(
		tu.InlineKeyboardRow(
			tu.InlineKeyboardButton("Start").WithWebApp(&wa),
		),
	)
	msg := tu.Message(tu.ID(chatID), "Press the button")
	msg.ReplyMarkup = k
	b.sendMessage(msg)
}
