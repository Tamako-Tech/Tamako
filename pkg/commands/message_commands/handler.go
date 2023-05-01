package message_commands

import (
	"context"

	"github.com/BearTS/Tamako/pkg/commands/message_commands/modules"
	"github.com/BearTS/Tamako/pkg/interfaces"
	"github.com/BearTS/Tamako/services/logger"

	"github.com/andersfylling/disgord"
	"github.com/andersfylling/disgord/std"
)

// This is the main function that handles all message commands
func HandleMessageCommands(ctx context.Context, client *disgord.Client) {
	handlePrefixCommands(ctx, client)
}

func GetCommands() map[string]interfaces.MessageCommand {
	return modules.CommandsMap
}

// handlePrefixCommands is a basic command handler to handle commands with a prefix
func handlePrefixCommands(ctx context.Context, client *disgord.Client) {
	prefix := "t!"

	logFilter, _ := std.NewLogFilter(client)
	filter, _ := std.NewMsgFilter(context.Background(), client)
	filter.SetPrefix(prefix)
	CommandMap := modules.CommandsMap

	client.Gateway().WithMiddleware(
		filter.NotByBot,    // ignore bot messages
		filter.HasPrefix,   // message must have the given prefix
		filter.StripPrefix, // remove the command prefix from the message
		logFilter.LogMsg,   // log command message
	).MessageCreate(func(s disgord.Session, data *disgord.MessageCreate) {
		msg := data.Message
		for commandName, commandHandler := range CommandMap {
			aliases := commandHandler.Aliases()
			aliases = append(aliases, commandName)
			for _, alias := range aliases {
				if msg.Content == alias {
					// Run the command
					if err := commandHandler.Run(context.Background(), s, msg); err != nil {
						// Log the error
						logger.Error(err, "Error handling command")
						return
					}
					break
				}
			}
		}
	})

}
