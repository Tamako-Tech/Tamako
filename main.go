package main

import (
	"context"
	"os"

	"github.com/BearTS/Tamako/pkg/message_commands/messageHandler"
	"github.com/andersfylling/disgord"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

var log = &logrus.Logger{
	Out:       os.Stderr,
	Formatter: new(logrus.TextFormatter),
	Hooks:     make(logrus.LevelHooks),
	Level:     logrus.InfoLevel,
}

var noCtx = context.Background()

// checkErr logs errors if not nil, along with a user-specified trace
func checkErr(err error, trace string) {
	if err != nil {
		log.WithFields(logrus.Fields{
			"trace": trace,
		}).Error(err)
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	client := disgord.New(disgord.Config{
		ProjectName: "MyBot",
		BotToken:    os.Getenv("DISCORD_TOKEN"),
		Logger:      log,
		Intents:     disgord.IntentGuildMessages,
		// ! Non-functional due to a current bug, will be fixed.
		Presence: &disgord.UpdateStatusPayload{
			Game: &disgord.Activity{
				Name: "with Disgord",
				Type: disgord.ActivityTypeCompeting,
			},
		},
	})

	defer client.Gateway().StayConnectedUntilInterrupted()

	messageHandler.HandleMessageCommands(client, noCtx)
	// create a handler and bind it to the bot init
	// dummy log print
	client.Gateway().BotReady(func() {
		log.Info("Bot is ready!")
	})
}
