package main

import (
	"context"
	"os"

	"github.com/andersfylling/disgord"
	"github.com/andersfylling/disgord/std"
	"github.com/sirupsen/logrus"
)

var (
	appID  disgord.Snowflake = disgord.Snowflake(0)
	client disgord.Session
)

var log = &logrus.Logger{
	Out:       os.Stderr,
	Formatter: new(logrus.TextFormatter),
	Hooks:     make(logrus.LevelHooks),
	Level:     logrus.DebugLevel,
}

func main() {
	slashCmds := []*disgord.CreateApplicationCommand{
		{
			Name:        "example_buttons",
			Description: "makes example button components. these components don't do anything.",
			Type:        disgord.ApplicationCommandChatInput,
		},
		{
			Name:        "example_select_menu",
			Description: "makes example select menu. these components don't do anything.",
			Type:        disgord.ApplicationCommandChatInput,
		},
		{
			Name:        "example_modal",
			Description: "makes example modal. these components don't do anything.",
			Type:        disgord.ApplicationCommandChatInput,
		},
		{
			Name:        "test_command",
			Description: "just testing",
			Options: []*disgord.ApplicationCommandOption{
				{
					Name:        "test_option",
					Type:        disgord.OptionTypeString,
					Description: "testing options",
					Choices: []*disgord.ApplicationCommandOptionChoice{
						{
							Name:  "test_choice",
							Value: "test_val",
						},
					},
				},
			},
		},
	}

	// Set up a new Disgord client
	client := disgord.New(disgord.Config{
		BotToken: os.Getenv("DISGORD_TOKEN"),
		Logger:   log,
		Intents:  disgord.IntentGuildMessages,
	})
	defer client.Gateway().StayConnectedUntilInterrupted()

	// ? Slash commands
	client.Gateway().BotReady(func() {
		for i := 0; i < len(slashCmds); i++ {
			err := client.ApplicationCommand(appID).Guild(486833611564253184).Create(slashCmds[i])
			if err != nil {
				log.Error(err)
			}
		}
	})
	client.Gateway().InteractionCreateChan(
		exampleButtonsIntCreateHandler,
		exampleSelectMenuIntCreateHandler,
		exampleModalIntCreateHandler,
		exampleModalSubmitIntCreateHandler,
	)

	// Normal message handler
	content, _ := std.NewMsgFilter(context.Background(), client)
	content.SetPrefix("ping")
	client.Gateway().
		WithMiddleware(content.HasPrefix).
		MessageCreate(func(s disgord.Session, evt *disgord.MessageCreate) {
			_, _ = evt.Message.Reply(context.Background(), s, "pong")
		})
}
