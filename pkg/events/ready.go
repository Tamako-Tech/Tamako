package events

import (
	"context"

	"github.com/BearTS/Tamako/pkg/application_commands/modules"
	"github.com/BearTS/Tamako/utils/logger"

	"github.com/andersfylling/disgord"
)

func botOnReady(ctx context.Context, client *disgord.Client) {
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
}
