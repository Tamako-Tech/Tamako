package messageHandler

import (
	"context"

	"github.com/BearTS/Tamako/pkg/message_commands/modules"
	"github.com/BearTS/Tamako/utils/logger"
	"github.com/andersfylling/disgord"
	"github.com/andersfylling/disgord/std"
)

// This is the main function that handles all message commands
func HandleMessageCommands(client *disgord.Client, ctx context.Context) {
	handleBotMentionCommands(client, ctx)
	handlePrefixCommands(client, ctx)
}

// handlePrefixCommands is a basic command handler to handle commands with a prefix
func handlePrefixCommands(client *disgord.Client, ctx context.Context) {
	prefix := "t!"

	logFilter, _ := std.NewLogFilter(client)
	filter, _ := std.NewMsgFilter(context.Background(), client)
	filter.SetPrefix(prefix)

	client.Gateway().WithMiddleware(
		filter.NotByBot,    // ignore bot messages
		filter.HasPrefix,   // message must have the given prefix
		filter.StripPrefix, // remove the command prefix from the message
		logFilter.LogMsg,   // log command message
	).MessageCreate(func(s disgord.Session, data *disgord.MessageCreate) {
		msg := data.Message
		if commandHandler, ok := modules.CommandsMap[msg.Content]; ok {
			if err := commandHandler.Run(context.Background(), s, msg); err != nil {
				logger.Error(err, "Error handling command")
				return
			}
		}
	})

}

// handleBotMentionCommands is a basic command handler to handle commands with a bot mention prefix
func handleBotMentionCommands(client *disgord.Client, ctx context.Context) {
	filter, _ := std.NewMsgFilter(context.Background(), client)

	client.Gateway().WithMiddleware(
		filter.NotByBot,            // ignore bot messages
		filter.HasBotMentionPrefix, // message must have the given prefix
		filter.StripPrefix,         // remove the command prefix from the message
	).MessageCreate(func(s disgord.Session, data *disgord.MessageCreate) {
		msg := data.Message
		if commandHandler, ok := modules.CommandsMap[msg.Content]; ok {
			if err := commandHandler.Run(context.Background(), s, msg); err != nil {
				logger.Error(err, "Error handling command")
				return
			}
		}
	})
}
