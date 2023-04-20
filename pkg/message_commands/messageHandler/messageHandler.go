package messageHandler

import (
	"context"

	"github.com/BearTS/Tamako/pkg/message_commands/modules"
	"github.com/BearTS/Tamako/utils/logger"
	"github.com/andersfylling/disgord"
	"github.com/andersfylling/disgord/std"
)

func HandleMessageCommands(client *disgord.Client, ctx context.Context) {
	handleBotMentionCommands(client, ctx)
	handlePrefixCommands(client, ctx)
}

// handleMsg is a basic command handler
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
		switch msg.Content {
		case "ping": // whenever the message written is "ping", the bot replies "pong"
			_, err := msg.Reply(context.Background(), s, "pong")
			logger.Error(err, "Error replying to message")
		default: // unknown command, bot does nothing.
			return
		}
	})

}

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
