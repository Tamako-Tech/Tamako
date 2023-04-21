package handler

import (
	"context"

	"github.com/BearTS/Tamako/pkg/application_commands/modules"
	"github.com/BearTS/Tamako/utils/logger"
	"github.com/andersfylling/disgord"
)

// This is the main function that handles all message commands
func HandleApplicationCommands(client *disgord.Client, ctx context.Context) {
	// register commands once the bot is ready
	client.Gateway().BotReady(func() {
		for i := range modules.Commands {
			// application command id is 0 here
			// on a ready event, the client is updated to store the application id
			// you can fetch the application id using the bot id (current user id) or copy it from
			// the discord page.
			if err := client.ApplicationCommand(0).Guild(744871453060759682).Create(modules.Commands[i]); err != nil {
				logger.Error(err, "Error creating application command")
			}
		}
	})

	// handle application commands
	client.Gateway().InteractionCreate(func(s disgord.Session, i *disgord.InteractionCreate) {
		if i.Type == disgord.InteractionApplicationCommand {
			if commandHandler, ok := modules.CommandsMap[i.Data.Name]; ok {
				if err := commandHandler.Run(context.Background(), s, i); err != nil {
					logger.Trace(err, "Error handling command")
					return
				}
			}
		}
	})

}
