package main

import (
	"context"
	"encoding/json"
	"os"

	applicationCommandsHandler "github.com/BearTS/Tamako/pkg/application_commands"
	"github.com/BearTS/Tamako/pkg/events"
	messageCommandsHandler "github.com/BearTS/Tamako/pkg/message_commands"
	"github.com/BearTS/Tamako/pkg/structs"
	"github.com/BearTS/Tamako/services/registry"

	"github.com/andersfylling/disgord"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

var ctx = context.Background()

var log = &logrus.Logger{
	Out:       os.Stderr,
	Formatter: new(logrus.TextFormatter),
	Hooks:     make(logrus.LevelHooks),
	Level:     logrus.InfoLevel,
}

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

	messageCommandsMap := messageCommandsHandler.GetCommands()

	var commandsMap []structs.CommandsMap

	for _, v := range messageCommandsMap {
		name := v.Name()
		description := v.Description()
		category := v.Category()

		commandsMap = append(commandsMap, structs.CommandsMap{
			Name:        name,
			Description: description,
			Category:    category,
		})
	}

	b, err := json.Marshal(commandsMap)
	if err != nil {
		panic(err)
	}

	// Register Commands to internal cache
	registry.GetInstance().SetValue("commands", b)

	// load events
	events.LoadEvents(ctx, client)

	messageCommandsHandler.HandleMessageCommands(ctx, client)
	applicationCommandsHandler.HandleApplicationCommands(ctx, client)
	// create a handler and bind it to the bot init
	// dummy log print
	client.Gateway().BotReady(func() {
		log.Info("Bot is ready!")
	})
}
