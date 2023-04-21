package handler

import (
	"context"

	"github.com/BearTS/Tamako/pkg/application_commands/modules"
	"github.com/BearTS/Tamako/utils/logger"
	"github.com/andersfylling/disgord"
)

// This is the main function that handles all message commands
func HandleApplicationCommands(client *disgord.Client, ctx context.Context) {
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
