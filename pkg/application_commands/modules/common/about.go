package common

import (
	"context"

	"github.com/BearTS/Tamako/pkg/embed_maps/modules/common_embeds"

	"github.com/andersfylling/disgord"
)

// AboutCommand struct
type AboutCommand struct{}

func (a AboutCommand) Name() string {
	return "about"
}

func (a AboutCommand) Description() string {
	return "About Tamako"
}

func (a AboutCommand) Options() []*disgord.ApplicationCommandOption {
	return nil
}

func (a AboutCommand) Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error {

	// Create the embed.
	updatedEmbed := common_embeds.GetAboutEmbed()

	// Edit the message with the new embed.
	if err := interaction.Reply(ctx, s, &disgord.CreateInteractionResponse{
		Type: disgord.InteractionCallbackChannelMessageWithSource,
		Data: &disgord.CreateInteractionResponseData{
			Embeds: []*disgord.Embed{updatedEmbed},
		},
	}); err != nil {
		return err
	}

	return nil
}
