package utility

import (
	"context"
	"time"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"

	"github.com/andersfylling/disgord"
)

// PingCommand struct
type PingCommand struct{}

func (p PingCommand) Name() string {
	return "ping"
}

func (p PingCommand) Description() string {
	return "Responds with 'pong'"
}

func (p PingCommand) Options() []*disgord.ApplicationCommandOption {
	return nil
}

func (p PingCommand) Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error {
	// Record the current time.
	t1 := time.Now()

	loadingEmbed, _ := utility_embeds.GetPingEmbed(0)

	// Send a message to measure the time taken to edit it.
	if err := interaction.Reply(ctx, s, &disgord.CreateInteractionResponse{
		Type: disgord.InteractionCallbackChannelMessageWithSource,
		Data: &disgord.CreateInteractionResponseData{
			Embeds: []*disgord.Embed{loadingEmbed},
		},
	}); err != nil {
		return err
	}

	// Record the new time.
	// Record the time taken to send the message and edit it.
	t2 := time.Now()
	latency := t2.Sub(t1)

	// Create the embed.
	_, updatedEmbed := utility_embeds.GetPingEmbed(latency)

	// Edit the message with the new embed.
	if err := interaction.Edit(ctx, s, &disgord.UpdateMessage{
		Embeds: &[]*disgord.Embed{updatedEmbed},
	}); err != nil {
		return err
	}

	return nil
}
