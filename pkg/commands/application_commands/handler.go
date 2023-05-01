package application_commands

import (
	"context"

	"github.com/BearTS/Tamako/pkg/commands/application_commands/modules"
	"github.com/BearTS/Tamako/services/logger"

	"github.com/andersfylling/disgord"
)

// This is the main function that handles all application commands
func HandleApplicationCommands(ctx context.Context, client *disgord.Client) {
	// handle application commands
	client.Gateway().InteractionCreate(func(s disgord.Session, i *disgord.InteractionCreate) {
		if i.Type == disgord.InteractionApplicationCommand {
			// instead of using commandsMap use commands slice
			for command := range modules.Commands {
				if i.Data.Name == command.Name() {
					if err := command.Run(context.Background(), s, i); err != nil {
						logger.Trace(err, "Error handling command")
						return
					}
					break
				}
			}
		}
	})
}
